
'use server';

import * as admin from 'firebase-admin';

// This is the definitive, correct, and robust way to initialize the Firebase Admin SDK
// for a Next.js application that needs to run in both a live Google Cloud environment
// and a local development environment.

if (!admin.apps.length) {
  try {
    // When deployed to a Google Cloud environment (like Firebase App Hosting), the SDK
    // will automatically use the project's default service account credentials
    // (Application Default Credentials or ADC). This is secure and requires no config.
    // For local development, you must set the GOOGLE_APPLICATION_CREDENTIALS
    // environment variable to point to your service-account.json file.
    admin.initializeApp({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    // This provides a more helpful error message for both scenarios.
    let message = `Failed to initialize Firebase Admin SDK. Error: ${error.message}.`;
    if (process.env.NODE_ENV !== 'production') {
      message += " For local development, ensure the 'GOOGLE_APPLICATION_CREDENTIALS' environment variable is set to the path of your service-account.json file.";
    } else {
      message += " In production, this likely indicates an issue with the service account permissions in your Google Cloud project.";
    }
    throw new Error(message);
  }
}

export const adminMessaging = admin.messaging();
