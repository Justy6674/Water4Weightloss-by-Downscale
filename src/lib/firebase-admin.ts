
'use server';

import * as admin from 'firebase-admin';
import serviceAccount from '../../service-account.json';

// This file initializes the Firebase Admin SDK for server-side operations.
// It checks if the app is already initialized to prevent re-initialization,
// which is a common issue in Next.js with hot-reloading.

if (!admin.apps.length) {
  try {
    // Initialize the Admin SDK using the service account credentials.
    // The `admin.credential.cert()` method correctly processes the service account JSON object.
    admin.initializeApp({
      // We cast the imported JSON to the type the SDK expects.
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } catch (error: any) {
    // If initialization fails, log the error and throw a new, more descriptive error
    // to halt the server and make the issue immediately visible. This is crucial for debugging.
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    throw new Error(`Failed to initialize Firebase Admin SDK. Check the service-account.json file and server logs. Error: ${error.message}`);
  }
}

// Export the initialized services for use in other server-side files (e.g., Server Actions).
export const adminMessaging = admin.messaging();
