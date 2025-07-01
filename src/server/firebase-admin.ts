
'use server';

import { cert, getApp, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { getMessaging, type Messaging } from 'firebase-admin/messaging';

let adminApp: App;
let adminDb: Firestore;
let adminMessaging: Messaging;

try {
    const existingApp = getApps().find(app => app.name === 'firebase-admin-app');
    if (existingApp) {
        adminApp = existingApp;
    } else {
        const serviceAccountJson = process.env.SERVICE_ACCOUNT_JSON;

        if (!serviceAccountJson) {
            throw new Error("CRITICAL: The SERVICE_ACCOUNT_JSON environment variable is not set.");
        }

        let serviceAccount;
        try {
            // With a correctly formatted multi-line environment variable, no string replacement is needed.
            serviceAccount = JSON.parse(serviceAccountJson);
        } catch (e) {
            console.error("CRITICAL: Failed to parse SERVICE_ACCOUNT_JSON. Ensure it is a valid, multi-line JSON string in your .env.local file.", e);
            throw new Error("CRITICAL: The SERVICE_ACCOUNT_JSON environment variable is not valid JSON.");
        }
        
        adminApp = initializeApp({
            credential: cert(serviceAccount),
            databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
        }, 'firebase-admin-app');
    }

    adminDb = getFirestore(adminApp);
    adminMessaging = getMessaging(adminApp);
    
} catch (error) {
    console.error("CRITICAL FAILURE: Could not initialize Firebase Admin SDK.", error);
    throw error;
}

export { adminDb, adminMessaging, adminApp };
export { adminApp as admin };
