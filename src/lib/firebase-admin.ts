
'use server';

import * as admin from 'firebase-admin';
import { config } from 'dotenv';

// Explicitly load environment variables from .env.local for server-side code.
// This is crucial for local development.
config();

// This check prevents re-initialization in scenarios like hot-reloading.
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    // The private key from an environment variable needs to have its newlines correctly formatted.
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

    // Primary method: Use environment variables. This is for local development or explicitly configured servers.
    if (projectId && clientEmail && privateKey) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
    } else {
        // Fallback method: Use Application Default Credentials for deployed Google Cloud environments (like App Hosting).
        // This method automatically finds the correct credentials when running on Google Cloud.
        admin.initializeApp();
    }
  } catch (error: any) {
    // If initialization fails now, it points to a fundamental issue with the credentials or permissions.
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    throw new Error(`Failed to initialize Firebase Admin SDK. For local development, ensure FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY are correctly set in your .env.local file. For deployed environments, ensure the service account has the necessary permissions. Error: ${error.message}`);
  }
}

// Export the initialized services for use in other server-side files (e.g., Server Actions).
export const adminMessaging = admin.messaging();
