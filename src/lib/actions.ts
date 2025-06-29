
'use server';

import { db } from '@/lib/firebase';
import { adminMessaging } from '@/lib/firebase-admin';
import { doc, getDoc, setDoc, serverTimestamp, type Timestamp, deleteDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { sendSms } from '@/services/send-sms';
import { type UserData, defaultUserData, type WeightReading, type BloodPressureReading } from '@/lib/user-data';
import { generateReminder } from '@/ai/flows/reminder-message-flow';
import { differenceInHours, isToday } from 'date-fns';


/**
 * Ensures that any Firestore Timestamp objects are converted to ISO strings,
 * which are safe to pass from Server Components to Client Components.
 */
function makeDataSerializable(data: object): any {
    const sanitizedData: { [key: string]: any } = {};

    for (const key in data) {
        const value = (data as any)[key];
        if (value instanceof Timestamp) {
            sanitizedData[key] = value.toDate().toISOString();
        } else if (Array.isArray(value)) {
            sanitizedData[key] = value.map(item => {
                if (item && typeof item === 'object' && item.timestamp instanceof Timestamp) {
                    return { ...item, timestamp: item.timestamp.toDate().toISOString() };
                }
                return item;
            });
        } else if (value && typeof value === 'object' && !(value instanceof Timestamp)) {
            sanitizedData[key] = makeDataSerializable(value);
        }
        else {
            sanitizedData[key] = value;
        }
    }
    return sanitizedData;
}


/**
 * Creates a user document in Firestore if one doesn't already exist.
 * This is an idempotent operation, safe to call on every login.
 * @param userId - The ID of the user to create a document for.
 */
export async function ensureUserDocument(userId: string): Promise<void> {
    if (!userId) {
        console.error("ensureUserDocument called without a userId.");
        return;
    }
    const userDocRef = doc(db, 'users', userId);

    try {
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
            await setDoc(userDocRef, {
                ...defaultUserData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        }
    } catch (error) {
         console.error("Firebase Error: Failed to ensure user document:", error);
         if (error instanceof Error && 'code' in error && (error as any).code === 'permission-denied') {
            throw new Error("DATABASE ACCESS DENIED. Could not create user profile. Please check your Firestore security rules.");
        }
        throw new Error("A database error occurred while creating the user profile.");
    }
}


/**
 * Fetches user data from Firestore. Assumes the document already exists.
 * This function also ensures the returned data is serializable for Next.js.
 */
export async function getUserData(userId: string): Promise<UserData> {
    const userDocRef = doc(db, 'users', userId);
    try {
        await ensureUserDocument(userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            // Document exists, return its data after ensuring it's serializable
            const existingData = userDocSnap.data() as UserData;
            return makeDataSerializable(existingData);
        } else {
            // This is now an unexpected error, as the document should have been created on login.
            console.error(`CRITICAL: User document not found for user ${userId} and could not be created.`);
            throw new Error("Your user profile could not be found or created. Please check database permissions.");
        }
    } catch (error) {
        console.error("Firebase Error: Failed to get document.", error);
        let errorMessage = "Could not connect to the database. Please ensure Firestore is enabled in your Firebase project and that your security rules allow access.";
        if (error instanceof Error) {
            if (error.message.includes("DATABASE ACCESS DENIED")) {
                return Promise.reject(error); // Re-throw the specific error to be caught by the UI
            }
            if ('code' in error) {
                const firebaseError = error as { code: string; message: string };
                if (firebaseError.code === 'permission-denied' || firebaseError.code === 'unauthenticated') {
                    errorMessage = "DATABASE ACCESS DENIED. This is a security rules issue. Go to your Firebase Console -> Firestore Database -> Rules, and change `allow read, write: if false;` to `allow read, write: if request.auth != null;`. This allows any logged-in user to access their data.";
                } else if (firebaseError.code === 'failed-precondition') {
                     errorMessage = "Firestore database has not been created or is misconfigured. Please go to the Firestore Database section of your Firebase Console and ensure a database exists by clicking 'Create database'.";
                } else {
                    // Include the specific Firebase error code for better debugging
                    errorMessage = `A Firebase error occurred: ${firebaseError.message} (Code: ${firebaseError.code}). Please check your Firebase setup.`;
                }
            }
        }
        throw new Error(errorMessage);
    }
}

/**
 * Updates user data in Firestore with the provided partial data.
 */
export async function updateUserData(userId: string, data: Partial<UserData>): Promise<void> {
    if (!userId) {
        throw new Error("Update failed: No user ID provided.");
    };
    const userDocRef = doc(db, 'users', userId);
    try {
        await setDoc(userDocRef, {
            ...data,
            updatedAt: serverTimestamp(),
        }, { merge: true });
    } catch (error) {
        console.error("Firebase Error: Failed to update user data:", error);
        let errorMessage = "Could not save data to the database. Please check your Firestore connection and permissions.";
         if (error instanceof Error && 'code' in error) {
            const firebaseError = error as { code: string; message: string };
            if (firebaseError.code === 'permission-denied') {
                 errorMessage = "Could not save data due to a permissions issue. Please check your Firestore Security Rules in the Firebase console.";
            } else {
                errorMessage = `A Firebase error occurred while saving data: ${firebaseError.message} (Code: ${firebaseError.code}).`;
            }
        }
        throw new Error(errorMessage);
    }
}

/**
 * Deletes a user's data document from Firestore.
 * @param userId - The ID of the user whose data should be deleted.
 */
export async function deleteUserData(userId: string): Promise<void> {
    if (!userId) {
        throw new Error("Cannot delete data: No user ID provided.");
    }
    const userDocRef = doc(db, 'users', userId);
    try {
        await deleteDoc(userDocRef);
    } catch (error) {
        console.error("Firebase Error: Failed to delete user data:", error);
        if (error instanceof Error && 'code' in error && (error as any).code === 'permission-denied') {
            throw new Error("Could not delete user data due to a permissions issue. Check your Firestore security rules.");
        }
        throw new Error("Could not delete user data from the database. Please check your connection and permissions.");
    }
}


/**
 * Saves the user's phone number and sends a confirmation SMS.
 */
export async function savePhoneNumberAndSendConfirmation(userId: string, phone: string) {
  if (!userId || !phone) {
    throw new Error('User ID and phone number are required.');
  }

  const userDocRef = doc(db, 'users', userId);
  try {
    // Use updateDoc with dot notation to avoid overwriting the entire bodyMetrics object
    await updateDoc(userDocRef, {
        'bodyMetrics.phone': phone,
        updatedAt: serverTimestamp()
    });

    // Send the confirmation SMS
    await sendSms(phone, `Thanks for signing up for Water4Weightloss notifications! We'll keep you hydrated.`);
    
    return { success: true, message: 'Phone number saved and confirmation sent.' };
  } catch (error) {
    console.error('Error in savePhoneNumberAndSendConfirmation:', error);
    if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
             return { success: false, message: "Could not save phone number due to a permissions issue. Please check your Firestore Security Rules." };
        }
        return { success: false, message: error.message };
    }
    return { success: false, message: 'An unknown error occurred.' };
  }
}

/**
 * Adds a new blood pressure reading to the user's log.
 */
export async function addBloodPressureReading(userId: string, newReading: Omit<BloodPressureReading, 'timestamp'>): Promise<void> {
    if (!userId) {
        throw new Error("Update failed: No user ID provided.");
    }
    const userDocRef = doc(db, 'users', userId);
    try {
        const readingWithTimestamp = {
            ...newReading,
            timestamp: serverTimestamp()
        };
        await updateDoc(userDocRef, {
            bloodPressureLog: arrayUnion(readingWithTimestamp),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Firebase Error: Failed to add blood pressure reading:", error);
        throw new Error("Could not save blood pressure reading to the database.");
    }
}

/**
 * Adds a new weight reading to the user's log.
 */
export async function addWeightReading(userId: string, newReading: Omit<WeightReading, 'timestamp'>): Promise<void> {
    if (!userId) {
        throw new Error("Update failed: No user ID provided.");
    }
    const userDocRef = doc(db, 'users', userId);
    try {
        const readingWithTimestamp = {
            ...newReading,
            timestamp: serverTimestamp()
        };
        // Also update the main weight metric for quick access
        await updateDoc(userDocRef, {
            weightLog: arrayUnion(readingWithTimestamp),
            'bodyMetrics.weight': newReading.weight.toString(),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Firebase Error: Failed to add weight reading:", error);
        throw new Error("Could not save weight reading to the database.");
    }
}

/**
 * Saves a new FCM token for a user, ensuring no duplicates.
 */
export async function saveFcmToken(userId: string, token: string): Promise<void> {
    if (!userId || !token) {
        throw new Error("User ID and token are required.");
    }
    const userDocRef = doc(db, 'users', userId);
    try {
        await updateDoc(userDocRef, {
            fcmTokens: arrayUnion(token),
            updatedAt: serverTimestamp(),
        });
    } catch (error) {
        console.error("Firebase Error: Failed to save FCM token:", error);
        throw new Error("Could not save notification token to the database.");
    }
}

/**
 * Sends a test push notification to a user.
 */
export async function sendTestNotification(userId: string): Promise<{success: boolean, message: string}> {
    if (!userId) {
        throw new Error("User ID is required.");
    }

    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
        return { success: false, message: "User not found." };
    }

    const userData = userDocSnap.data() as UserData;
    const tokens = userData.fcmTokens;

    if (!tokens || tokens.length === 0) {
        return { success: false, message: "No notification tokens found for this user. Please enable notifications and try again." };
    }

    const message = {
        notification: {
            title: 'Water4Weightloss Test',
            body: '💧 This is a test notification to confirm everything is working!',
        },
        tokens: tokens,
    };

    try {
        const response = await adminMessaging.sendMulticast(message);
        console.log('Successfully sent message:', response);
        if (response.failureCount > 0) {
            const failedTokens: string[] = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    failedTokens.push(tokens[idx]);
                }
            });
            console.warn('List of tokens that caused failures: ' + failedTokens);
            return { success: false, message: `Sent, but ${response.failureCount} message(s) failed. Check server logs.` };
        }
        return { success: true, message: `Test notification sent to ${response.successCount} device(s).` };
    } catch (error) {
        console.error('Error sending test notification:', error);
        if (error instanceof Error && error.message.includes('auth-error')) {
             return { success: false, message: "Authentication error with FCM. Check your server credentials." };
        }
        return { success: false, message: "An error occurred while sending the notification." };
    }
}

/**
 * This function would be triggered by a scheduled job (e.g., a cron job) for each user.
 * It checks if a reminder is needed and sends one via Push Notification and/or SMS.
 */
export async function sendReminder(userId: string) {
    if (!userId) {
        console.error("sendReminder called without userId.");
        return { success: false, message: "User ID is required." };
    }

    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
        return { success: false, message: "User not found." };
    }

    const userData = userDocSnap.data() as UserData;
    const { appSettings, bodyMetrics, hydration, dailyGoal, motivationTone, updatedAt, lastSmsSentDate, smsSentCount } = userData;

    // 1. Check if reminders are enabled at all
    if (appSettings.notificationFrequency === 'off' || (!appSettings.pushNotifications && !appSettings.smsReminders)) {
        return { success: true, message: "User has reminders turned off." };
    }

    // 2. Check if a reminder is due based on frequency
    const now = new Date();
    const lastUpdate = (updatedAt as Timestamp)?.toDate() || new Date();
    const hoursSinceLastDrink = differenceInHours(now, lastUpdate);
    let shouldSend = false;

    switch (appSettings.notificationFrequency) {
        case 'hourly':
            if (hoursSinceLastDrink >= 1) shouldSend = true;
            break;
        case 'four-hours':
            if (hoursSinceLastDrink >= 4) shouldSend = true;
            break;
        case 'intelligent':
            // Simple intelligent logic: send if it's been > 2 hours and they are behind schedule
            if (hoursSinceLastDrink >= 2 && (hydration / dailyGoal) < (now.getHours() / 24)) {
                shouldSend = true;
            }
            break;
    }
    
    if (!shouldSend) {
         return { success: true, message: "No reminder needed at this time." };
    }

    // 3. Generate the reminder message
    const hydrationPercentage = (hydration / dailyGoal) * 100;
    const timeOfDay = now.getHours() < 12 ? "morning" : now.getHours() < 18 ? "afternoon" : "evening";
    
    const reminder = await generateReminder({
        hydrationPercentage,
        preferredTone: motivationTone,
        timeSinceLastDrink: `${hoursSinceLastDrink} hour(s)`,
        timeOfDay,
    });
    const messageBody = reminder.message;

    // 4. Send notifications
    let pushSent = false;
    let smsSent = false;
    let newSmsCount = smsSentCount || 0;

    if (appSettings.pushNotifications && userData.fcmTokens && userData.fcmTokens.length > 0) {
        const message = {
            notification: { title: 'Hydration Reminder', body: messageBody },
            tokens: userData.fcmTokens,
        };
        await adminMessaging.sendMulticast(message);
        pushSent = true;
    }

    if (appSettings.smsReminders && bodyMetrics.phone) {
        const lastSentDate = (lastSmsSentDate as Timestamp)?.toDate();
        const smsCount = isToday(lastSentDate || 0) ? newSmsCount : 0;

        if (smsCount < 2) {
            try {
                await sendSms(bodyMetrics.phone, messageBody);
                smsSent = true;
                newSmsCount = smsCount + 1;
                // Update the user's document with the new count and date
                await updateDoc(userDocRef, {
                    smsSentCount: newSmsCount,
                    lastSmsSentDate: serverTimestamp(),
                    updatedAt: serverTimestamp() 
                });
            } catch (e) {
                console.error(`Failed to send SMS to user ${userId}`, e);
            }
        } else {
            console.log(`SMS limit reached for user ${userId} today.`);
        }
    }

    return { success: true, message: `Reminder sent. Push: ${pushSent}, SMS: ${smsSent}`};
}
