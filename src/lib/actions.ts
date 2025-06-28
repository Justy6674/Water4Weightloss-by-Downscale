'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// In a real app, you'd get this from Firebase Auth after implementing a login flow.
const FAKE_USER_ID = "test-user-123";

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
        medication?: string;
        medicationFrequency?: string;
        medicationDose: string;
        medicationReminder: boolean;
    };
    updatedAt?: any;
    createdAt?: any;
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
    medication: undefined,
    medicationFrequency: undefined,
    medicationDose: "",
    medicationReminder: false,
};

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
 * Fetches user data from Firestore or creates it if it doesn't exist.
 */
export async function getUserData(): Promise<UserData> {
    const userDocRef = doc(db, 'users', FAKE_USER_ID);
    try {
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const data = userDocSnap.data() as UserData;
            // Handle non-serializable Timestamps
            return JSON.parse(JSON.stringify(data));
        } else {
            // Create a new user document with default values
            await setDoc(userDocRef, {
                ...defaultUserData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            
            // Re-fetch to get server-generated timestamps and ensure consistency
            const newUserSnap = await getDoc(userDocRef);
            const data = newUserSnap.data();
            return JSON.parse(JSON.stringify(data));
        }
    } catch (error) {
        console.error("Firebase Error: Failed to get document.", error);
        // This custom error will be more informative for the user if it's a setup issue.
        throw new Error("Could not connect to the database. Please ensure Firestore is enabled in your Firebase project and that your .env.local file is configured correctly.");
    }
}

/**
 * Updates user data in Firestore.
 * @param data - The partial user data to update.
 */
export async function updateUserData(data: Partial<UserData>): Promise<void> {
    if (!FAKE_USER_ID) return;
    const userDocRef = doc(db, 'users', FAKE_USER_ID);
    try {
        await setDoc(userDocRef, {
            ...data,
            updatedAt: serverTimestamp(),
        }, { merge: true });
    } catch (error) {
        console.error("Firebase Error: Failed to update user data:", error);
        throw new Error("Could not save data to the database. Please check your Firestore connection and permissions.");
    }
}
