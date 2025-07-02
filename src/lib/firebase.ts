import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { getMessaging, isSupported, Messaging } from "firebase/messaging";
import { validateClientEnv } from './env-validation';
import getConfig from 'next/config';

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _messaging: Messaging | null = null;
let initialized = false;

// Get runtime config as fallback
function getEnvVar(key: string): string | undefined {
  // First try process.env
  if (process.env[key]) {
    return process.env[key];
  }
  
  // Fallback to Next.js runtime config
  try {
    const { publicRuntimeConfig } = getConfig() || { publicRuntimeConfig: {} };
    return publicRuntimeConfig[key];
  } catch {
    return undefined;
  }
}

// Lazy initialization function - only runs when needed
function initializeFirebase(): void {
  if (initialized) return;
  
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      console.warn('Firebase initialization skipped - not in browser environment');
      return;
    }

    const firebaseConfig = {
      apiKey: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY'),
      authDomain: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
      projectId: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
      storageBucket: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
      messagingSenderId: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
      appId: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID'),
    };

    // Check if all required config is present
    const missingVars = Object.entries(firebaseConfig)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingVars.length > 0) {
      throw new Error(`Missing Firebase config: ${missingVars.join(', ')}`);
    }

    // Initialize Firebase
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

    // Connect to emulators in development
    if (process.env.NODE_ENV === 'development') {
      const authEmulatorUrl = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;
      const firestoreEmulatorHost = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST;
      
      if (authEmulatorUrl && _auth && !(_auth as any)._delegate._config.emulator) {
        connectAuthEmulator(_auth, `http://${authEmulatorUrl}`, { disableWarnings: true });
      }
      
      if (firestoreEmulatorHost && _db && !(_db as any)._delegate._databaseId.projectId.includes('demo-')) {
        const [host, port] = firestoreEmulatorHost.split(':');
        connectFirestoreEmulator(_db, host, parseInt(port));
      }
    }

    initialized = true;
    console.log('Firebase initialized successfully');

  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    
    // In production, throw the error to be handled by error boundaries
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Firebase configuration is invalid. Please check your environment variables.');
    }
  }
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

// Legacy exports for backward compatibility - these will lazy-load
export const app = new Proxy({} as FirebaseApp, {
  get(target, prop) {
    return getFirebaseApp()[prop as keyof FirebaseApp];
  }
});

export const auth = new Proxy({} as Auth, {
  get(target, prop) {
    return getFirebaseAuth()[prop as keyof Auth];
  }
});

export const db = new Proxy({} as Firestore, {
  get(target, prop) {
    return getFirebaseDb()[prop as keyof Firestore];
  }
});

export { _messaging as messaging };
