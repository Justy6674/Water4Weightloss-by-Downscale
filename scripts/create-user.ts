
import { getAdminDb } from '../src/server/firebase-admin';
import { defaultUserData } from '../src/lib/user-data';
import * as admin from 'firebase-admin';

async function createUser(userId: string) {
    if (!userId) {
        console.error('User ID is required.');
        return;
    }

    try {
        const adminDb = await getAdminDb();
        const userDocRef = adminDb.collection('users').doc(userId);
        await userDocRef.set({
            ...defaultUserData,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            fcmTokens: ['test-fcm-token']
        });
        console.log(`User document created for user ${userId}.`);
    } catch (error) {
        console.error('Error creating user document:', error);
    }
}

// Get the User ID from the command line arguments
const userId = process.argv[2];
if (!userId) {
    console.error('Please provide a User ID as a command line argument.');
    process.exit(1);
}

createUser(userId).then(() => {
    process.exit(0);
});
