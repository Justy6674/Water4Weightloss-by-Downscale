
'use server';
import 'dotenv/config';
import * as admin from 'firebase-admin';

// This guard ensures the app is only initialized ONCE.
if (!admin.apps.length) {
  try {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
    };

    // For local development, we use environment variables. In a deployed Google
    // Cloud environment, the SDK can use Application Default Credentials.
    if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
      console.log("Initializing Firebase Admin with environment variables for local development...");
      admin.initializeApp({
        credential: admin.credential.cert({
          project_id: serviceAccount.projectId,
          client_email: serviceAccount.clientEmail,
          // The `replace` call is crucial for correcting the private key format from an env var.
          private_key: serviceAccount.privateKey.replace(/\\n/g, '\n'),
        }),
        projectId: serviceAccount.projectId,
      });
    } else {
      // This path is for DEPLOYED environments (e.g., App Hosting).
      // It assumes the environment is already authenticated.
      console.log("Initializing Firebase Admin with Application Default Credentials for production...");
      admin.initializeApp();
    }
  } catch (error: any) {
    let errorMessage = `Failed to initialize Firebase Admin SDK. Error: ${error.message}.`;
    if (error.message.includes('INTERNAL')) {
      errorMessage += " This is often due to malformed credentials being passed to the SDK."
    }
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    // Throw a detailed error message that guides the user.
    throw new Error(errorMessage + " Please check your credentials and environment setup as described in the README.");
  }
}

export const adminMessaging = admin.messaging();
