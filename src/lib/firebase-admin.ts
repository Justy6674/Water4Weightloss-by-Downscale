
'use server';
import 'dotenv/config';
import * as admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// This guard ensures the app is only initialized ONCE.
if (!admin.apps.length) {
  try {
    const serviceAccountPath = path.resolve(process.cwd(), 'service-account.json');

    if (fs.existsSync(serviceAccountPath)) {
      // LOCAL DEVELOPMENT: Use the service account file from the project root.
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      
      // Validate the file content to prevent cryptic errors from the SDK.
      if (!serviceAccount.project_id || !serviceAccount.private_key || serviceAccount.project_id.includes("YOUR_")) {
          throw new Error("The service-account.json file is incomplete or contains placeholder values. Please populate it with your actual credentials for local development.");
      }

      console.log("Initializing Firebase Admin with local service-account.json...");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });

    } else {
      // DEPLOYED (PRODUCTION) ENVIRONMENT: Use Application Default Credentials.
      // This is the standard for Google App Hosting, Cloud Run, etc., where the environment is authenticated.
      console.log("Initializing Firebase Admin with Application Default Credentials...");
      admin.initializeApp();
    }
  } catch (error: any) {
    let errorMessage = `Failed to initialize Firebase Admin SDK. Error: ${error.message}.`;
    
    if (error.message.includes('ENOENT')) {
        errorMessage += " This might be because 'service-account.json' is missing for local development, and Application Default Credentials are not set up.";
    } else if (error.code === 'app/invalid-credential') {
        errorMessage += " The credential used to initialize the Admin SDK is invalid. Check your service account file or hosting environment's permissions.";
    }
    
    console.error('CRITICAL: Firebase Admin SDK initialization failed.', error);
    // Throw a detailed error message that guides the user.
    throw new Error(errorMessage + " Please check your credentials and environment setup as described in the README.");
  }
}

export const adminMessaging = admin.messaging();
