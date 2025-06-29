'use server';

import * as admin from 'firebase-admin';
// The service-account.json is in the root directory, so this relative path is correct.
import serviceAccount from '../../service-account.json';

// This is the correct way to initialize the admin SDK as a singleton.
if (!admin.apps.length) {
    // In a deployed Google Cloud environment (like App Hosting),
    // GOOGLE_APPLICATION_CREDENTIALS will be automatically set.
    // Locally, it will use the service account file.
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as any),
    });
}

export const adminDb = admin.firestore();
export const adminMessaging = admin.messaging();
