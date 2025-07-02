import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getMessaging, isSupported, Messaging } from "firebase/messaging";
import { firebaseConfig } from './firebase-config';

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _messaging: Messaging | null = null;
let initialized = false;

// Simple initialization function
function initializeFirebase(): void {
  if (initialized) return;
  
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      console.warn('Firebase initialization skipped - not in browser environment');
      return;
    }

    // Initialize Firebase with hardcoded config
    _app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    _auth = getAuth(_app);
    _db = getFirestore(_app);

    // Initialize messaging with feature detection
    isSupported().then((supported) => {
      if (supported && _app) {
        _messaging = getMessaging(_app);
      } else {
        console.warn('Firebase messaging is not supported in this browser');
      }
    }).catch((error) => {
      console.warn('Error checking messaging support:', error);
    });

    initialized = true;
    console.log('Firebase initialized successfully');

  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    throw new Error('Firebase configuration is invalid.');
  }
}

// Auto-initialize Firebase when this module is imported in browser
if (typeof window !== 'undefined') {
  initializeFirebase();
}

// Getter functions that ensure initialization
export function getFirebaseApp(): FirebaseApp {
  if (!_app) {
    initializeFirebase();
    if (!_app) {
      throw new Error('Firebase app failed to initialize');
    }
  }
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (!_auth) {
    initializeFirebase();
    if (!_auth) {
      throw new Error('Firebase auth failed to initialize');
    }
  }
  return _auth;
}

export function getFirebaseDb(): Firestore {
  if (!_db) {
    initializeFirebase();
    if (!_db) {
      throw new Error('Firebase firestore failed to initialize');
    }
  }
  return _db;
}

export function getFirebaseMessaging(): Messaging | null {
  if (!initialized) {
    initializeFirebase();
  }
  return _messaging;
}

// Direct exports - no Proxy pattern
export const app = getFirebaseApp();
export const auth = getFirebaseAuth();
export const db = getFirebaseDb();
export const messaging = getFirebaseMessaging();
