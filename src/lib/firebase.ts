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

// Safe initialization function that only runs in browser
function initializeFirebase(): void {
  if (initialized || typeof window === 'undefined') return;
  
  try {
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

// Getter functions that ensure initialization
export function getFirebaseApp(): FirebaseApp {
  if (typeof window === 'undefined') {
    throw new Error('Firebase app can only be used in browser environment');
  }
  if (!_app) {
    initializeFirebase();
    if (!_app) {
      throw new Error('Firebase app failed to initialize');
    }
  }
  return _app;
}

export function getFirebaseAuth(): Auth {
  if (typeof window === 'undefined') {
    throw new Error('Firebase auth can only be used in browser environment');
  }
  if (!_auth) {
    initializeFirebase();
    if (!_auth) {
      throw new Error('Firebase auth failed to initialize');
    }
  }
  return _auth;
}

export function getFirebaseDb(): Firestore {
  if (typeof window === 'undefined') {
    throw new Error('Firebase firestore can only be used in browser environment');
  }
  if (!_db) {
    initializeFirebase();
    if (!_db) {
      throw new Error('Firebase firestore failed to initialize');
    }
  }
  return _db;
}

export function getFirebaseMessaging(): Messaging | null {
  if (typeof window === 'undefined') {
    return null;
  }
  if (!initialized) {
    initializeFirebase();
  }
  return _messaging;
}

// Create a safe object that can be imported but won't initialize during SSR
function createSafeFirebaseExport<T>(getter: () => T, name: string): T {
  if (typeof window === 'undefined') {
    // Return a placeholder object that will throw helpful errors during SSR
    return new Proxy({} as T, {
      get() {
        throw new Error(`${name} cannot be used during server-side rendering. Make sure to use it only in client components with "use client" directive.`);
      }
    });
  }
  
  // In browser, return the actual Firebase instance
  return getter();
}

// Safe exports that work in both server and client environments
export const app = createSafeFirebaseExport(getFirebaseApp, 'Firebase app');
export const auth = createSafeFirebaseExport(getFirebaseAuth, 'Firebase auth');
export const db = createSafeFirebaseExport(getFirebaseDb, 'Firebase firestore');
export const messaging = createSafeFirebaseExport(() => getFirebaseMessaging(), 'Firebase messaging');
