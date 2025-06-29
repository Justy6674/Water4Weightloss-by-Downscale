
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
          errorMessage = `CRITICAL: The 'service-account.json' file was not found in the project root. Please verify it is in the root directory and contains your actual credentials.`;
      } else if (error instanceof SyntaxError) {
          errorMessage = `CRITICAL: The 'service-account.json' file is not valid JSON. Please re-download it from your Firebase project settings and ensure it is not corrupted.`;
      } else if (error.message.includes('Invalid PEM formatted message')) {
          errorMessage = `CRITICAL: The private key in 'service-account.json' is malformed. This is an internal error in the credentials file itself. Please re-download the file from Firebase.`;
      }
      
      console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
      // Throw a detailed error to make debugging easier for the user.
      throw new Error(`${errorMessage}. Please check your credentials and environment setup.`);
    }
  }
}

export const adminMessaging = admin.messaging();
