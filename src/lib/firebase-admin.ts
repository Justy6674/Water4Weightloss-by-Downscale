
'use server';

import * as admin from 'firebase-admin';

// This guard ensures the SDK is initialized only once.
if (!admin.apps.length) {
  try {
    // This setup is designed to work for both local development and deployment.
    // It relies on the service-account.json file being present and correct.
    console.log('Initializing Firebase Admin SDK...');
    const serviceAccount = require('../../service-account.json');
    
    // Validate that the required properties exist.
    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email || serviceAccount.project_id.includes('YOUR_PROJECT_ID')) {
        throw new Error('The service-account.json file is missing, incomplete, or contains placeholder values. Please ensure it is correctly placed in the root directory and contains your project\'s actual credentials.');
    }

    // CRITICAL FIX: The private key from the JSON file is a single string with literal "\\n" sequences.
    // The Firebase Admin SDK's PEM parser requires actual newline characters.
    // This replacement is essential for the key to be parsed correctly.
    const formattedPrivateKey = serviceAccount.private_key.replace(/\\n/g, '\n');

    admin.initializeApp({
      credential: admin.credential.cert({
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          privateKey: formattedPrivateKey, // Use the correctly formatted key
      }),
      projectId: serviceAccount.project_id,
    });
    console.log('Firebase Admin SDK initialized successfully.');

  } catch (error: any) {
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    // Throw a detailed error to make debugging easier for the user.
    throw new Error(`Failed to initialize Firebase Admin SDK. Error: ${error.message}. Please check your credentials and environment setup.`);
  }
}

export const adminMessaging = admin.messaging();
