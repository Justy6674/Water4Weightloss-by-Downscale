
'use server';

import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // When deployed to a Google Cloud environment (like App Hosting), the NODE_ENV is 'production'.
    // In this case, the Admin SDK can automatically find the service account credentials.
    if (process.env.NODE_ENV === 'production') {
      console.log('Initializing Firebase Admin SDK for Production (Application Default Credentials)...');
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
      console.log('Firebase Admin SDK initialized successfully for production.');
    } else {
      // For local development, we load the service account file directly.
      console.log('Initializing Firebase Admin SDK for Local Development (service-account.json)...');
      const serviceAccount = require('../../service-account.json');
      
      // A robust check to ensure the service account file is valid before attempting to initialize.
      if (!serviceAccount || !serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
          throw new Error('The service-account.json file is missing, incomplete, or not a valid JSON. Please ensure it is correctly populated for local development.');
      }

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
      console.log('Firebase Admin SDK initialized successfully for local development.');
    }
  } catch (error: any) {
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    // Throw a detailed error to make debugging easier.
    let detailedError = `Failed to initialize Firebase Admin SDK. Error: ${error.message}.`;
    if (process.env.NODE_ENV === 'production') {
        detailedError += " In production, this usually indicates an issue with the service account's IAM permissions in your Google Cloud project. Ensure the service account has the 'Firebase Admin SDK Administrator Service Agent' role or equivalent permissions."
    } else {
        detailedError += " For local development, please ensure your service-account.json file is present in the project root and is a valid JSON credential file."
    }
    throw new Error(detailedError);
  }
}

export const adminMessaging = admin.messaging();
