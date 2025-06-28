
'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, type Timestamp, deleteDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { sendSms } from '@/services/send-sms';
import { type UserData, defaultUserData, type WeightReading, type BloodPressureReading } from '@/lib/user-data';

/**
 * Ensures that any Firestore Timestamp objects are converted to ISO strings,
 * which are safe to pass from Server Components to Client Components.
 */
function makeDataSerializable(data: object): any {
    const sanitizedData: { [key: string]: any } = {};

    for (const key in data) {
        const value = (data as any)[key];
        if (value && typeof value === 'object' && 'toDate' in value) {
            sanitizedData[key] = value.toDate().toISOString();
        } else if (Array.isArray(value)) {
            sanitizedData[key] = value.map(item => {
                if (item && typeof item === 'object' && 'toDate' in item) {
                    return item.toDate().toISOString();
                }
                if (item && typeof item === 'object' && item.timestamp && 'toDate' in item.timestamp) {
                    return { ...item, timestamp: item.timestamp.toDate().toISOString() };
                }
                return item;
            });
        } else {
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

  try {
    // Save the phone number to the user's document
    await updateUserData(userId, { bodyMetrics: { phone } as any });

    // Send the confirmation SMS
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
