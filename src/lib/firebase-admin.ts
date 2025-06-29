
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
      const serviceAccountString = fs.readFile(serviceAccountPath, 'utf8');
      
      // Use a promise-based approach to handle the async file read
      serviceAccountString.then(data => {
        const serviceAccount = JSON.parse(data);

        // **THE CRITICAL FIX FOR PEM ERROR**: Replace escaped newlines with actual newlines.
        if (serviceAccount.private_key) {
          serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
        
        // Validate that the service account is not using placeholder values
        if (!serviceAccount.project_id || serviceAccount.project_id.includes('PASTE_YOUR')) {
            throw new Error("The service-account.json file contains placeholder values. Please ensure it is correctly populated with your project's actual credentials.");
        }

        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: serviceAccount.project_id,
        });
        console.log("Firebase Admin SDK initialized successfully for local development.");

      }).catch(error => {
        let errorMessage = `Failed to initialize Firebase Admin SDK. Error: ${error.message}`;

        if (error.code === 'ENOENT') {
            errorMessage = `CRITICAL: The 'service-account.json' file was not found in the project root. Please verify it is in the root directory and contains your actual credentials.`;
        } else if (error instanceof SyntaxError) {
            errorMessage = `CRITICAL: The 'service-account.json' file is not valid JSON. Please re-download it from your Firebase project settings and ensure it is not corrupted.`;
        } 
        
        console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
        // We re-throw here to ensure the server fails loudly on a critical configuration error.
        throw new Error(`${errorMessage}. Please check your credentials and environment setup.`);
      });

    } catch (error: any) {
        // This outer catch is for any synchronous errors during setup.
        console.error('CRITICAL: Synchronous error during Firebase Admin SDK initialization setup.', error);
        throw new Error(`Failed to set up Firebase Admin SDK initialization. Error: ${error.message}`);
    }
  }
}

export const adminMessaging = admin.messaging();
