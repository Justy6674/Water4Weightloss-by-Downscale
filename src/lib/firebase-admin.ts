
'use server';

// The 'dotenv' package is required to load environment variables from .env.local for server-side code.
// This is crucial for local development and the build process.
import 'dotenv/config';
import * as admin from 'firebase-admin';

// This guard ensures the SDK is initialized only once.
if (!admin.apps.length) {
  try {
    console.log('Attempting to initialize Firebase Admin SDK...');
    
    // This is the correct, robust way to initialize for both local and deployed environments.
    // It prioritizes environment variables for local development, which is safer and more standard than file I/O.
    // For deployed environments (like App Hosting), it will fall back to Application Default Credentials.
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // IMPORTANT: Fix for PEM key formatting
    };

    if (serviceAccount.projectId && serviceAccount.clientEmail && serviceAccount.privateKey) {
        // Use service account from environment variables (for local/build)
        console.log('Initializing with environment variables.');
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: serviceAccount.projectId,
        });
    } else {
        // Use Application Default Credentials (for deployed environment)
        console.log('Initializing with Application Default Credentials.');
        admin.initializeApp({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // Use the public project ID as a hint
        });
    }

    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error: any) {
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    // Provide a clear error message that guides the user.
    throw new Error(`Failed to initialize Firebase Admin SDK. Error: ${error.message}. Please check your credentials and environment setup as described in the README.`);
  }
}

export const adminMessaging = admin.messaging();
