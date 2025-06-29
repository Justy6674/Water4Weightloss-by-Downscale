
'use server';

// This file uses 'dotenv/config' to ensure that environment variables from .env.local
// are loaded for server-side code, which is essential for local development and build processes.
import 'dotenv/config';
import * as admin from 'firebase-admin';

// This is the configuration object we'll build from environment variables for local development.
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  // IMPORTANT: The private key must be correctly formatted.
  // The `replace` call is essential for handling the key when it's stored as a single-line environment variable.
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Check if all necessary parts of the service account are available from environment variables.
const hasServiceAccount = serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey;

// Initialize the app ONLY if it hasn't been initialized yet to prevent errors.
if (!admin.apps.length) {
  try {
    if (hasServiceAccount) {
      // Use the service account from environment variables.
      // This is the primary and correct method for local development.
      console.log("Initializing Firebase Admin with Service Account from environment variables...");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.projectId,
      });
    } else {
      // Use Application Default Credentials.
      // This is the standard for deployed environments like Google App Hosting.
      // It will work automatically if the service account has the correct IAM roles.
      console.log("Initializing Firebase Admin with Application Default Credentials...");
      admin.initializeApp();
    }
  } catch (error: any) {
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    // Provide a clear error message that guides the user.
    throw new Error(`Failed to initialize Firebase Admin SDK. Error: ${error.message}. Please check your credentials and environment setup as described in the README.`);
  }
}

export const adminMessaging = admin.messaging();
