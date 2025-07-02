'use server';

import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

let adminApp: any = null;
let adminDb: any = null;
let adminMessaging: any = null;

function initializeFirebaseAdmin() {
  if (adminApp) return; // Already initialized

  try {
    // Check if already initialized
    const existingApps = getApps();
    if (existingApps.length > 0) {
      adminApp = existingApps[0];
      adminDb = getFirestore(adminApp);
      adminMessaging = getMessaging(adminApp);
      return;
    }

    // Get service account from environment
    const serviceAccountJson = process.env.SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) {
      throw new Error('SERVICE_ACCOUNT_JSON environment variable not found');
    }

    // Parse the service account JSON
    let serviceAccount;
    try {
      // Handle both escaped and unescaped JSON
      const cleanJson = serviceAccountJson.replace(/\\n/g, '\n');
      serviceAccount = JSON.parse(cleanJson);
    } catch (parseError) {
      throw new Error(`Failed to parse SERVICE_ACCOUNT_JSON: ${parseError}`);
    }

    // Validate required fields
    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
      throw new Error('Invalid service account JSON - missing required fields');
    }

    // Initialize Firebase Admin
    adminApp = initializeApp({
      credential: cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}-default-rtdb.firebaseio.com/`,
      projectId: serviceAccount.project_id
    });

    adminDb = getFirestore(adminApp);
    adminMessaging = getMessaging(adminApp);

    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error);
    throw error;
  }
}

// Initialize on import
try {
  initializeFirebaseAdmin();
} catch (error) {
  console.error('CRITICAL: Firebase Admin failed to initialize:', error);
}

export async function getAdminApp() {
  if (!adminApp) {
    initializeFirebaseAdmin();
  }
  return adminApp;
}

export async function getAdminDb() {
  if (!adminDb) {
    initializeFirebaseAdmin();
  }
  return adminDb;
}

export async function getAdminMessaging() {
  if (!adminMessaging) {
    initializeFirebaseAdmin();
  }
  return adminMessaging;
}
