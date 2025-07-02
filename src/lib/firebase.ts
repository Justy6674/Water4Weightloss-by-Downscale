import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth";
import { getMessaging, isSupported, Messaging } from "firebase/messaging";
import { validateClientEnv } from './env-validation';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let messaging: Messaging | null = null;
let initialized = false;

// Lazy initialization function - only runs when needed
function initializeFirebase(): void {
  if (initialized) return;
  
  try {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      console.warn('Firebase initialization skipped - not in browser environment');
      return;
    }

    const env = validateClientEnv();
    
    const firebaseConfig = {
      apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    // Initialize Firebase
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);

    // Initialize messaging with feature detection
    isSupported().then((supported) => {
      if (supported && app) {
        messaging = getMessaging(app);
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
      
      if (authEmulatorUrl && auth && !(auth as any)._delegate._config.emulator) {
        connectAuthEmulator(auth, `http://${authEmulatorUrl}`, { disableWarnings: true });
      }
      
      if (firestoreEmulatorHost && db && !(db as any)._delegate._databaseId.projectId.includes('demo-')) {
        const [host, port] = firestoreEmulatorHost.split(':');
        connectFirestoreEmulator(db, host, parseInt(port));
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
  if (!app) {
    initializeFirebase();
    if (!app) {
      throw new Error('Firebase app failed to initialize');
    }
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    initializeFirebase();
    if (!auth) {
      throw new Error('Firebase auth failed to initialize');
    }
  }
  return auth;
}

export function getFirebaseDb(): Firestore {
  if (!db) {
    initializeFirebase();
    if (!db) {
      throw new Error('Firebase firestore failed to initialize');
    }
  }
  return db;
}

export function getFirebaseMessaging(): Messaging | null {
  if (!initialized) {
    initializeFirebase();
  }
  return messaging;
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

export { messaging };
