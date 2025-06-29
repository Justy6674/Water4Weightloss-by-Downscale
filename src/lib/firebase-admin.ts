'use server';

import * as admin from 'firebase-admin';
import serviceAccount from '../../service-account.json';

if (!admin.apps.length) {
  try {
    // For production, use Application Default Credentials provided by the hosting environment.
    // For local development, use the local service account file.
    if (process.env.NODE_ENV === 'production') {
      admin.initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
       console.log('Firebase Admin SDK initialized using Application Default Credentials for production.');
    } else {
      // Ensure the service account has the required properties for local dev
      if (!serviceAccount || !serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
          throw new Error('The service-account.json file is missing or incomplete. Please ensure it is correctly populated for local development.');
      }
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
        projectId: serviceAccount.project_id,
      });
      console.log('Firebase Admin SDK initialized using service-account.json for local development.');
    }
  } catch (error: any) {
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    let message = `Failed to initialize Firebase Admin SDK. Error: ${error.message}.`;
    if (process.env.NODE_ENV !== 'production') {
        message += " For local development, please ensure your service-account.json file is correctly populated."
    } else {
        message += " In production, this likely indicates an issue with the service account permissions in your Google Cloud project.";
    }
    throw new Error(message);
  }
}

export const adminMessaging = admin.messaging();
