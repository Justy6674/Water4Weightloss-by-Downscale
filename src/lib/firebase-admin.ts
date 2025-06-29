
'use server';

import * as admin from 'firebase-admin';

// This file initializes the Firebase Admin SDK for server-side operations.
// It checks if the app is already initialized to prevent re-initialization,
// which is a common issue in Next.js with hot-reloading.

if (!admin.apps.length) {
  try {
    // In a managed Google Cloud environment like App Hosting or Cloud Run,
    // calling initializeApp() without arguments automatically uses
    // Application Default Credentials (ADC). The service account is
    // provisioned by the environment, making this the most secure and
    // robust method. It removes the need to handle credential files
    // or environment variables directly in the code.
    admin.initializeApp();
  } catch (error: any) {
    // If initialization fails even with ADC, it points to a fundamental
    // environment configuration issue.
    console.error('CRITICAL: Firebase Admin SDK initialization failed with ADC.', error);
    // We throw an error to halt server startup and make the problem visible immediately.
    throw new Error(`Failed to initialize Firebase Admin SDK. This is likely an issue with the hosting environment's service account permissions. Error: ${error.message}`);
  }
}

// Export the initialized services for use in other server-side files (e.g., Server Actions).
export const adminMessaging = admin.messaging();
