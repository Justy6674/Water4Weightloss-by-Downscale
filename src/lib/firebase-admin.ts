
'use server';

import * as admin from 'firebase-admin';

// This file initializes the Firebase Admin SDK for server-side operations.
// It now exclusively uses environment variables for configuration, which is the
// secure and standard practice for production applications.

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  // The private key from an environment variable needs to have its newlines correctly formatted.
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin SDK environment variables are not set. Please set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY in your .env.local file for local development, as described in the README.md.'
    );
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (error: any) {
    // If initialization fails now, it points to a fundamental issue with the
    // credentials provided in the environment variables.
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    throw new Error(`Failed to initialize Firebase Admin SDK. Please check the Admin SDK environment variables. Error: ${error.message}`);
  }
}

// Export the initialized services for use in other server-side files (e.g., Server Actions).
export const adminMessaging = admin.messaging();
