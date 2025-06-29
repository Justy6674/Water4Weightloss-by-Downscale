
'use server';

import * as admin from 'firebase-admin';
import serviceAccount from '@/../service-account.json';

// This file initializes the Firebase Admin SDK for server-side operations.
// It checks if the app is already initialized to prevent re-initialization,
// which is a common issue in Next.js with hot-reloading.

if (!admin.apps.length) {
  try {
    // This is the most direct and reliable way to initialize the Admin SDK
    // when a service account file is present in the project. It avoids
    // issues with environment variables or Application Default Credentials.
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } catch (error: any) {
    // If initialization fails now, it points to a fundamental issue with the
    // service account file itself or the Firebase Admin SDK.
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    throw new Error(`Failed to initialize Firebase Admin SDK. Please check the validity of your service-account.json file. Error: ${error.message}`);
  }
}

// Export the initialized services for use in other server-side files (e.g., Server Actions).
export const adminMessaging = admin.messaging();
