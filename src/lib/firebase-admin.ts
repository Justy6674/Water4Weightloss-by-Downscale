
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
      const serviceAccountString = await fs.readFile(serviceAccountPath, 'utf8');
      const serviceAccount = JSON.parse(serviceAccountString);

      // Validate that the service account file is not just a template
      if (!serviceAccount.project_id || serviceAccount.project_id.includes('PASTE_YOUR')) {
          throw new Error('The service-account.json file contains placeholder values. Please ensure it contains your project\'s actual credentials, which you can download from the Firebase console.');
      }

      // **THE CRITICAL FIX FOR PEM ERROR**: Replace escaped newlines with actual newlines.
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
      console.log("Firebase Admin SDK initialized successfully for local development.");

    } catch (error: any) {
      let errorMessage = `Failed to initialize Firebase Admin SDK. Error: ${error.message}`;

      if (error.code === 'ENOENT') {
          errorMessage = `CRITICAL: The 'service-account.json' file was not found in the project root. You stated you created it, so this may be a pathing issue. Please verify it is in the root directory and named correctly.`;
      } else if (error instanceof SyntaxError) {
          errorMessage = `CRITICAL: The 'service-account.json' file is not valid JSON. Please re-download it from your Firebase project settings and ensure it is not corrupted.`;
      }
      
      console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
      // Throw a detailed error to make debugging easier for the user.
      throw new Error(`${errorMessage}. Please check your credentials and environment setup.`);
    }
  }
}

export const adminMessaging = admin.messaging();
