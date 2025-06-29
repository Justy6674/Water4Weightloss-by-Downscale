
'use server';
import * as admin from 'firebase-admin';
import { promises as fs } from 'fs';
import path from 'path';

// This guard ensures the app is only initialized ONCE.
if (!admin.apps.length) {
  try {
    // Determine the path to the service account key.
    // VERCEL_ENV is a system environment variable provided by Vercel, useful for detecting production.
    // In a Firebase/Google Cloud environment, you might check for GOOGLE_CLOUD_PROJECT.
    const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

    if (isProduction) {
      // In a production environment (like Vercel or App Hosting),
      // we use environment variables for the credentials.
      console.log("Initializing Firebase Admin with environment variables for production...");
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
      };

      if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
        throw new Error('Production environment variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY) are not set.');
      }

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
      // In a local development environment, we read the service account file directly.
      console.log("Initializing Firebase Admin with service-account.json for local development...");
      const serviceAccountPath = path.resolve(process.cwd(), 'service-account.json');
      const serviceAccount = JSON.parse(await fs.readFile(serviceAccountPath, 'utf8'));
      
      if (!serviceAccount.project_id || !serviceAccount.client_email || !serviceAccount.private_key) {
        throw new Error('The service-account.json file is missing required fields (project_id, client_email, private_key).');
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
    }

  } catch (error: any) {
    let errorMessage = `Failed to initialize Firebase Admin SDK. Error: ${error.message}.`;

    if (error.code === 'ENOENT') {
        errorMessage = 'Failed to initialize Firebase Admin SDK for local development. The service-account.json file was not found in the project root. Please ensure it exists and is correctly named.';
    } else if (error.message.includes('private key')) {
        errorMessage = `Failed to initialize Firebase Admin SDK due to a private key error. Please ensure your service-account.json file or environment variables are correct. Error: ${error.message}`;
    }
    
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', errorMessage);
    // Throw a detailed error to make debugging easier for the user.
    throw new Error(`${errorMessage} Please check your credentials and environment setup.`);
  }
}

export const adminMessaging = admin.messaging();
