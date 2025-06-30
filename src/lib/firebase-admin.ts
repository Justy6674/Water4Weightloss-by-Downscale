
'use server';

import { initializeApp, cert, getApps, getApp, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

let adminApp: App;

try {
    const serviceAccountKey = process.env.SERVICE_ACCOUNT_JSON;
    if (!serviceAccountKey) {
        throw new Error('The SERVICE_ACCOUNT_JSON environment variable is not set. Please see the README.md for instructions.');
    }

    const serviceAccount = JSON.parse(serviceAccountKey);

    if (getApps().length === 0) {
        adminApp = initializeApp({
            credential: cert(serviceAccount),
        });
    } else {
        adminApp = getApp();
    }
} catch (error: any) {
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    // Provide a clear error message that guides the user.
    throw new Error(`Failed to initialize Firebase Admin SDK. Error: ${error.message}. Please check your credentials and environment setup as described in the README.`);
}

const adminDb = getFirestore(adminApp);
const adminMessaging = getMessaging(adminApp);

export { adminDb, adminMessaging };
