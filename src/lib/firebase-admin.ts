
'use server';

import * as admin from 'firebase-admin';

// This is the standard and most secure way to initialize the Firebase Admin SDK.
// It relies on Application Default Credentials (ADC), which are automatically
// available in Google Cloud environments like App Hosting.
// This avoids hardcoding service account keys in the source code.
if (!admin.apps.length) {
  try {
    admin.initializeApp();
  } catch (error: any) {
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    // Throw a clear error to stop the server from running in a broken state.
    // This makes debugging much easier if the environment is misconfigured.
    throw new Error(`Failed to initialize Firebase Admin SDK. This is likely a problem with Application Default Credentials. Error: ${error.message}`);
  }
}

// Export the initialized services
export const adminMessaging = admin.messaging();
