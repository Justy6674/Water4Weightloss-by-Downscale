
'use server';
import * as admin from 'firebase-admin';
import { promises as fs } from 'fs';
import path from 'path';

// This guard ensures the app is only initialized ONCE.
if (!admin.apps.length) {
  // Check if running in a Google Cloud environment (like App Hosting)
  if (process.env.K_SERVICE) {
    console.log("Initializing Firebase Admin SDK for production (using Application Default Credentials)...");
    admin.initializeApp();
  } else {
    // Local development: use the service account file.
    console.log("Initializing Firebase Admin SDK for local development (using service-account.json)...");
    try {
      const serviceAccountPath = path.resolve(process.cwd(), 'service-account.json');
      const serviceAccount = JSON.parse(await fs.readFile(serviceAccountPath, 'utf8'));

      // Validate that the service account file is not just a template
      if (!serviceAccount.project_id || serviceAccount.project_id.includes('PASTE_YOUR')) {
          throw new Error('The service-account.json file is missing, incomplete, or contains placeholder values. Please ensure it is correctly placed in the root directory and contains your project\'s actual credentials.');
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
      console.log("Firebase Admin SDK initialized successfully for local development.");

    } catch (error: any) {
      let errorMessage = `Failed to initialize Firebase Admin SDK. Error: ${error.message}.`;

      if (error.code === 'ENOENT') {
          errorMessage = `Failed to initialize Firebase Admin SDK. The service-account.json file was not found in the project root. Please ensure it exists and is correctly named. Refer to the README.md for setup instructions.`;
      }
      
      console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
      // Throw a detailed error to make debugging easier for the user.
      throw new Error(`${errorMessage}. Please check your credentials and environment setup.`);
    }
  }
}

export const adminMessaging = admin.messaging();
