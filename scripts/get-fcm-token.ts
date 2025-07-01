
import { adminDb } from '../src/server/firebase-admin';
import { UserData } from '../src/lib/user-data';

async function getFcmToken(userId: string): Promise<string | null> {
    if (!userId) {
        console.error('User ID is required.');
        return null;
    }

    try {
        const userDocRef = adminDb.collection('users').doc(userId);
        const userDocSnap = await userDocRef.get();

        if (userDocSnap.exists) {
            const userData = userDocSnap.data() as UserData;
            if (userData.fcmTokens && userData.fcmTokens.length > 0) {
                // Return the first token for testing purposes
                const token = userData.fcmTokens[0];
                console.log(`FCM Token found for user ${userId}: ${token}`);
                return token;
            } else {
                console.log(`No FCM tokens found for user ${userId}.`);
                return null;
            }
        } else {
            console.error(`User document not found for user ${userId}.`);
            return null;
        }
    } catch (error) {
        console.error('Error retrieving FCM token:', error);
        return null;
    }
}

// Get the User ID from the command line arguments
const userId = process.argv[2];
if (!userId) {
    console.error('Please provide a User ID as a command line argument.');
    process.exit(1);
}

getFcmToken(userId).then(token => {
    if (token) {
        console.log(token);
    }
    process.exit(0);
});
