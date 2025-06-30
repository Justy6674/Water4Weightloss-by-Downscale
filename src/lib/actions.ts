
'use server';

import { adminDb, adminMessaging } from '@/server/firebase-admin';
import * as admin from 'firebase-admin';
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
        if (value instanceof admin.firestore.Timestamp) {
            sanitizedData[key] = value.toDate().toISOString();
        } else if (Array.isArray(value)) {
            sanitizedData[key] = value.map(item => {
                if (item && typeof item === 'object' && item.timestamp instanceof admin.firestore.Timestamp) {
                    return { ...item, timestamp: item.timestamp.toDate().toISOString() };
                }
                return item;
            });
        } else if (value && typeof value === 'object' && !(value instanceof admin.firestore.Timestamp)) {
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
    const userDocRef = adminDb.collection('users').doc(userId);

    try {
        const userDocSnap = await userDocRef.get();
        if (!userDocSnap.exists) {
            await userDocRef.set({
                ...defaultUserData,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
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
    const userDocRef = adminDb.collection('users').doc(userId);
    try {
        await ensureUserDocument(userId);
        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists) {
            const existingData = userDocSnap.data() as UserData;
            return makeDataSerializable(existingData);
        } else {
            console.error(`CRITICAL: User document not found for user ${userId} and could not be created.`);
            throw new Error("Your user profile could not be found or created. Please check database permissions.");
        }
    } catch (error) {
        console.error("Firebase Error: Failed to get document.", error);
        let errorMessage = "Could not connect to the database. Please ensure Firestore is enabled in your Firebase project and that your security rules allow access.";
        if (error instanceof Error) {
            if (error.message.includes("DATABASE ACCESS DENIED")) {
                return Promise.reject(error);
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
    const userDocRef = adminDb.collection('users').doc(userId);
    try {
        await userDocRef.set({
            ...data,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    } catch (error) {
        console.error("Firebase Error: Failed to update user data:", error);
        throw new Error("Could not save data to the database. Please check your Firestore connection and permissions.");
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
    const userDocRef = adminDb.collection('users').doc(userId);
    try {
        await userDocRef.delete();
    } catch (error) {
        console.error("Firebase Error: Failed to delete user data:", error);
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

  const userDocRef = adminDb.collection('users').doc(userId);
  try {
    await userDocRef.update({
        'bodyMetrics.phone': phone,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await sendSms(phone, `Thanks for signing up for Water4Weightloss notifications! We'll keep you hydrated.`);
    
    return { success: true, message: 'Phone number saved and confirmation sent.' };
  } catch (error) {
    console.error('Error in savePhoneNumberAndSendConfirmation:', error);
    if (error instanceof Error) {
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
    const userDocRef = adminDb.collection('users').doc(userId);
    try {
        const readingWithTimestamp = {
            ...newReading,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };
        await userDocRef.update({
            bloodPressureLog: admin.firestore.FieldValue.arrayUnion(readingWithTimestamp),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
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
    const userDocRef = adminDb.collection('users').doc(userId);
    try {
        const readingWithTimestamp = {
            ...newReading,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        };
        await userDocRef.update({
            weightLog: admin.firestore.FieldValue.arrayUnion(readingWithTimestamp),
            'bodyMetrics.weight': newReading.weight.toString(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
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
    const userDocRef = adminDb.collection('users').doc(userId);
    try {
        await userDocRef.update({
            fcmTokens: admin.firestore.FieldValue.arrayUnion(token),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
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

    const userDocRef = adminDb.collection('users').doc(userId);
    const userDocSnap = await userDocRef.get();

    if (!userDocSnap.exists) {
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

    const userDocRef = adminDb.collection('users').doc(userId);
    const userDocSnap = await userDocRef.get();

    if (!userDocSnap.exists) {
        return { success: false, message: "User not found." };
    }

    const userData = userDocSnap.data() as UserData;
    const { appSettings, bodyMetrics, hydration, dailyGoal, motivationTone, updatedAt, lastSmsSentDate, smsSentCount } = userData;

    if (appSettings.notificationFrequency === 'off' || (!appSettings.pushNotifications && !appSettings.smsReminders)) {
        return { success: true, message: "User has reminders turned off." };
    }

    const now = new Date();
    const lastUpdate = (updatedAt as admin.firestore.Timestamp)?.toDate() || new Date();
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
            if (hoursSinceLastDrink >= 2 && (hydration / dailyGoal) < (now.getHours() / 24)) {
                shouldSend = true;
            }
            break;
    }
    
    if (!shouldSend) {
         return { success: true, message: "No reminder needed at this time." };
    }

    const hydrationPercentage = (hydration / dailyGoal) * 100;
    const timeOfDay = now.getHours() < 12 ? "morning" : now.getHours() < 18 ? "afternoon" : "evening";
    
    const reminder = await generateReminder({
        hydrationPercentage,
        preferredTone: motivationTone,
        timeSinceLastDrink: `${hoursSinceLastDrink} hour(s)`,
        timeOfDay,
    });
    const messageBody = reminder.message;

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
        const lastSentDateObj = (lastSmsSentDate as admin.firestore.Timestamp)?.toDate();
        const smsCountToday = lastSentDateObj && isToday(lastSentDateObj) ? newSmsCount : 0;

        if (smsCountToday < 2) {
            try {
                await sendSms(bodyMetrics.phone, messageBody);
                smsSent = true;
                await userDocRef.update({
                    smsSentCount: smsCountToday + 1,
                    lastSmsSentDate: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp() 
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
