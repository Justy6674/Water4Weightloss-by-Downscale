
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getMessaging, isSupported } from "firebase/messaging";
import { validateClientEnv } from './env-validation';

let app: any;
let auth: any;
let db: any;
let messaging: any;

try {
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
  if (typeof window !== 'undefined') {
    isSupported().then((supported) => {
      if (supported) {
        messaging = getMessaging(app);
      } else {
        console.warn('Firebase messaging is not supported in this browser');
      }
    }).catch((error) => {
      console.warn('Error checking messaging support:', error);
    });
  }

  // Connect to emulators in development
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    const authEmulatorUrl = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;
    const firestoreEmulatorHost = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST;
    
    if (authEmulatorUrl && !(auth as any)._delegate._config.emulator) {
      connectAuthEmulator(auth, `http://${authEmulatorUrl}`, { disableWarnings: true });
    }
    
    if (firestoreEmulatorHost && !(db as any)._delegate._databaseId.projectId.includes('demo-')) {
      const [host, port] = firestoreEmulatorHost.split(':');
      connectFirestoreEmulator(db, host, parseInt(port));
    }
  }

} catch (error) {
  console.error('Failed to initialize Firebase:', error);
  
  // Create fallback objects to prevent runtime errors
  auth = null;
  db = null;
  messaging = null;
  
  // In production, you might want to redirect to an error page
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Firebase configuration is invalid. Please check your environment variables.');
  }
}

export { app, db, auth, messaging };
