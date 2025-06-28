'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, type Timestamp, deleteDoc } from 'firebase/firestore';
import { sendSms } from '@/services/send-sms';

export type Tone = "funny" | "supportive" | "sarcastic" | "crass" | "kind";

export interface UserData {
    hydration: number;
    dailyGoal: number;
    streak: number;
    lastDrinkSize: number;
    motivationTone: Tone;
    appSettings: {
        dailyStreaks: boolean;
        achievementBadges: boolean;
        progressMilestones: boolean;
        confettiEffects: boolean;
        pushNotifications: boolean;
        smsReminders: boolean;
        notificationFrequency: "minimal" | "moderate" | "frequent";
        vibrationFeedback: "light" | "medium" | "heavy";
    };
    bodyMetrics: {
        weight: string;
        waist: string;
        height: string;
        gender?: string;
        phone?: string;
        medication?: string;
        medicationFrequency?: string;
        medicationDose: string;
        medicationReminder: boolean;
    };
    // Timestamps are stored as Firestore Timestamps but will be converted to strings for the client
    updatedAt?: string | Timestamp;
    createdAt?: string | Timestamp;
}

const defaultAppSettings: UserData['appSettings'] = {
    dailyStreaks: true,
    achievementBadges: true,
    progressMilestones: true,
    confettiEffects: true,
    pushNotifications: true,
    smsReminders: false,
    notificationFrequency: "moderate",
    vibrationFeedback: "medium",
};

const defaultBodyMetrics: UserData['bodyMetrics'] = {
    weight: "81.2",
    waist: "85",
    height: "175",
    phone: "",
    medication: undefined,
    medicationFrequency: undefined,
    medicationDose: "",
    medicationReminder: false,
};

// This is the data for a new user, without server-generated timestamps
const defaultUserData: Omit<UserData, 'updatedAt' | 'createdAt'> = {
    hydration: 1250,
    dailyGoal: 3000,
    streak: 14,
    lastDrinkSize: 0,
    motivationTone: "supportive",
    appSettings: defaultAppSettings,
    bodyMetrics: defaultBodyMetrics,
};

/**
 * Ensures that any Firestore Timestamp objects are converted to ISO strings,
 * which are safe to pass from Server Components to Client Components.
 */
function makeDataSerializable(data: object): any {
    return JSON.parse(JSON.stringify(data));
}


/**
 * Fetches user data from Firestore or creates it if it doesn't exist.
 * This function also ensures the returned data is serializable for Next.js.
 */
export async function getUserData(userId: string): Promise<UserData> {
    const userDocRef = doc(db, 'users', userId);
    try {
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            // Document exists, return its data after ensuring it's serializable
            const existingData = userDocSnap.data() as UserData;
            return makeDataSerializable(existingData);
        } else {
            // Document doesn't exist, create it with default values
            const newUserData = {
                ...defaultUserData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };
            await setDoc(userDocRef, newUserData);
            
            // Return the default data immediately for a fast UI response.
            // The server-generated timestamps will be fetched on the next load.
            return makeDataSerializable({
                ...defaultUserData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
        }
    } catch (error) {
        console.error("Firebase Error: Failed to get or create document.", error);
        let errorMessage = "Could not connect to the database. Please ensure Firestore is enabled in your Firebase project and that your security rules allow access.";
        if (error instanceof Error && 'code' in error) {
            const firebaseError = error as { code: string; message: string };
            if (firebaseError.code === 'permission-denied' || firebaseError.code === 'unauthenticated') {
                errorMessage = "Could not read data due to a permissions issue. Please check your Firestore Security Rules and that your .env.local file is configured correctly.";
            } else {
                // Include the specific Firebase error code for better debugging
                errorMessage = `A Firebase error occurred: ${firebaseError.message} (Code: ${firebaseError.code}). Please check your Firebase setup.`;
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
        console.error("Update failed: No user ID provided.");
        return;
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
                 errorMessage = "Could not save data. This is a permissions issue. Please check your Firestore Security Rules in the Firebase console.";
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
        throw new Error("Could not delete user data from the database. Please check your permissions.");
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
