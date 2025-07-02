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

    // Use individual environment variables (proper approach for Vercel)
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(`Missing Firebase Admin environment variables:
        - FIREBASE_PROJECT_ID: ${projectId ? 'SET' : 'MISSING'}
        - FIREBASE_CLIENT_EMAIL: ${clientEmail ? 'SET' : 'MISSING'}
        - FIREBASE_PRIVATE_KEY: ${privateKey ? 'SET' : 'MISSING'}`);
    }

    // Replace \n characters in private key (common issue with env vars)
    const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');

    // Initialize Firebase Admin with individual credentials
    adminApp = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: formattedPrivateKey,
      }),
      projectId,
    });

    adminDb = getFirestore(adminApp);
    adminMessaging = getMessaging(adminApp);

    console.log('Firebase Admin initialized successfully with individual env vars');
  } catch (error) {
    console.error('Firebase Admin initialization failed:', error);
    throw error;
  }
}

// Store on global to prevent re-initialization in development
if (typeof global !== 'undefined') {
  if (!global.firebaseAdmin) {
    try {
      initializeFirebaseAdmin();
      global.firebaseAdmin = true;
    } catch (error) {
      console.error('CRITICAL: Firebase Admin failed to initialize:', error);
    }
  }
} else {
  // Not in a global context, initialize normally
  try {
    initializeFirebaseAdmin();
  } catch (error) {
    console.error('CRITICAL: Firebase Admin failed to initialize:', error);
  }
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
