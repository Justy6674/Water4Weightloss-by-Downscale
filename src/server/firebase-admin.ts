
'use server';

import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

function initializeAdminApp() {
    const json = process.env.SERVICE_ACCOUNT_JSON;

    if (!json) {
        console.error("Firebase Admin Init Failed: SERVICE_ACCOUNT_JSON environment variable is not set.");
        throw new Error('SERVICE_ACCOUNT_JSON env-var is missing. This is required for deployment.');
    }

    try {
        const creds = JSON.parse(json);

        if (!creds.project_id || !creds.private_key || !creds.client_email) {
             console.error("Firebase Admin Init Failed: Parsed credentials object is missing required fields (project_id, private_key, client_email).");
             throw new Error('The provided service account JSON is malformed or incomplete.');
        }
        
        // This is the critical part. The private_key from a one-line env var has its newlines escaped.
        // The Firebase Admin SDK needs the newlines to be actual newline characters.
        creds.private_key = creds.private_key.replace(/\\n/g, '\n');

        const appName = 'firebase-admin-app';
        const existingApp = getApps().find(app => app.name === appName);
        if (existingApp) {
            return existingApp;
        }

        return initializeApp({ credential: cert(creds) }, appName);

    } catch (e: any) {
        console.error("Firebase Admin Init Failed: Could not parse SERVICE_ACCOUNT_JSON. Ensure it's a valid, single-line JSON string.", e.message);
        throw new Error('Failed to parse service account JSON. Check server logs for details.');
    }
}

const admin = initializeAdminApp();

export const adminDb = getFirestore(admin);
export const adminMessaging = getMessaging(admin);
