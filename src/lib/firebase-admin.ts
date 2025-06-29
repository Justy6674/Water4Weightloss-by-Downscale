
'use server';
import * as admin from 'firebase-admin';
import { promises as fs } from 'fs';
import path from 'path';

if (!admin.apps.length) {
  try {
    if (process.env.K_SERVICE) {
      console.log("Initializing Firebase Admin SDK for production (using Application Default Credentials)...");
      admin.initializeApp();
    } else {
      console.log("Initializing Firebase Admin SDK for local development (using service-account.json)...");
      const serviceAccountPath = path.resolve(process.cwd(), 'service-account.json');
      const serviceAccountString = await fs.readFile(serviceAccountPath, 'utf8');
      const serviceAccount = JSON.parse(serviceAccountString);

      if (!serviceAccount.project_id || serviceAccount.project_id.includes('PASTE_YOUR')) {
        throw new Error("The service-account.json file contains placeholder values. Please ensure it is correctly populated with your project's actual credentials.");
      }
      
      if (serviceAccount.private_key) {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
      console.log("Firebase Admin SDK initialized successfully for local development.");
    }
  } catch (error: any) {
    let errorMessage = `Failed to initialize Firebase Admin SDK. Error: ${error.message}. Please check your credentials and environment setup.`;
    
    if (error.code === 'ENOENT') {
        errorMessage = `CRITICAL: The 'service-account.json' file was not found in the project root. Please verify it is in the root directory and contains your actual credentials.`;
    } else if (error instanceof SyntaxError) {
        errorMessage = `CRITICAL: The 'service-account.json' file is not valid JSON. Please re-download it from your Firebase project settings.`;
    }

    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    throw new Error(errorMessage);
  }
}

export const adminMessaging = admin.messaging();
