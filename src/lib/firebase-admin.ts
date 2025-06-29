
'use server';
import 'dotenv/config'; // Ensures .env.local variables are loaded for local development
import * as admin from 'firebase-admin';

// This logic robustly handles both local development (via .env.local) and
// the deployed production environment (via Application Default Credentials).
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    // The private key from the JSON file comes with literal "\n" characters.
    // The .replace() call ensures they are converted to actual newlines.
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    // If the specific environment variables for local development are present, use them.
    if (projectId && clientEmail && privateKey) {
      console.log('Initializing Firebase Admin SDK from environment variables for local development...');
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      // Otherwise, assume we are in a deployed Google Cloud environment and
      // use Application Default Credentials. This is the standard for production.
      console.log('Local Firebase Admin credentials not found. Initializing with Application Default Credentials (for deployed environment)...');
      admin.initializeApp();
    }
  } catch (error: any) {
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    throw new Error(`Failed to initialize Firebase Admin SDK. Please check your environment variables (for local dev) or your hosting environment's service account permissions (for production). Error: ${error.message}`);
  }
}

export const adminMessaging = admin.messaging();
