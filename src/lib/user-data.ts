
import type { Timestamp } from 'firebase/firestore';

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
        gender: string | null;
        phone: string | null;
        medication: string | null;
        medicationFrequency: string | null;
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
    gender: null,
    phone: "",
    medication: null,
    medicationFrequency: null,
    medicationDose: "",
    medicationReminder: false,
};

// This is the data for a new user, without server-generated timestamps
export const defaultUserData: Omit<UserData, 'updatedAt' | 'createdAt'> = {
    hydration: 1250,
    dailyGoal: 3000,
    streak: 14,
    lastDrinkSize: 0,
    motivationTone: "supportive",
    appSettings: defaultAppSettings,
    bodyMetrics: defaultBodyMetrics,
};
