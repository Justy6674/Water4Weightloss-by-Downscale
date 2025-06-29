
'use server';

import * as admin from 'firebase-admin';
import serviceAccount from '../../service-account.json';

// This check prevents re-initialization in scenarios like Next.js hot-reloading.
if (!admin.apps.length) {
  try {
    // The service account file contains all necessary credentials.
    // The `as admin.ServiceAccount` cast ensures type safety.
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } catch (error: any) {
    // If initialization fails, it points to a fundamental issue with the
    // service account file itself (e.g., malformed JSON, invalid keys).
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    throw new Error(`Failed to initialize Firebase Admin SDK. Please check the validity of your service-account.json file. Error: ${error.message}`);
  }
}

// Export the initialized services for use in other server-side files.
export const adminMessaging = admin.messaging();
