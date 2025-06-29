
'use server';
import * as admin from 'firebase-admin';

// This is the definitive, correct, and robust way to initialize the Firebase Admin SDK
// for a Next.js application hosted on a Google Cloud environment (like Firebase App Hosting).
// It leverages Application Default Credentials (ADC), which is the secure, industry-standard method.

if (!admin.apps.length) {
  try {
    // The projectId is explicitly provided to guide the SDK, especially in environments
    // where it might be ambiguous. This is not a secret.
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!projectId) {
      // This is a critical configuration error. The app cannot function without knowing its project ID.
      throw new Error("CRITICAL: The NEXT_PUBLIC_FIREBASE_PROJECT_ID environment variable is not set. The application cannot start without it.");
    }
    
    // Initialize with the projectId to guide ADC. The actual secret credentials are supplied securely
    // by the hosting environment itself, not from the code.
    admin.initializeApp({ projectId });
    
    console.log('Firebase Admin SDK initialized successfully using Application Default Credentials.');

  } catch (error: any) {
    // If initialization fails, log the specific error and re-throw to halt the server.
    // This prevents the application from running in a broken state.
    console.error('CRITICAL: Firebase Admin SDK initialization failed with ADC.', error);
    throw new Error(`Failed to initialize Firebase Admin SDK. This is likely an issue with the hosting environment's service account permissions. Error: ${error.message}`);
  }
}

export const adminMessaging = admin.messaging();
