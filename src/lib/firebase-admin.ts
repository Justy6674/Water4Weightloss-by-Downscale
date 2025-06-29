
'use server';

import * as admin from 'firebase-admin';

// This guard ensures the SDK is initialized only once.
if (!admin.apps.length) {
  try {
    // When running locally or in a build environment, we rely on the service account file.
    console.log('Initializing Firebase Admin SDK with service account...');
    const serviceAccount = require('../../service-account.json');
    
    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
        throw new Error('The service-account.json file is missing, incomplete, or invalid. Please ensure it is correctly placed in the root directory and contains your project credentials.');
    }

    // CRITICAL FIX: The private key from the JSON file often has literal "\\n" 
    // which must be replaced with actual newline characters for the PEM parser to work.
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
    // Throw a detailed error to make debugging easier.
    throw new Error(`Failed to initialize Firebase Admin SDK. Error: ${error.message}. Please check your credentials and environment setup.`);
  }
}

export const adminMessaging = admin.messaging();
