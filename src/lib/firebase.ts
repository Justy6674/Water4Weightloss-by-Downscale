
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence, browserSessionPersistence } from "firebase/auth";
import { getMessaging } from "firebase/messaging";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Essential keys for core functionality (Auth, Firestore, App Check)
const requiredConfig = {
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
};

// Developer-friendly error if any essential key is missing
const missingKeys = Object.entries(requiredConfig)
  .filter(([, value]) => !value || value.includes("YOUR_"))
  .map(([key]) => key);

if (missingKeys.length > 0) {
    const keyMap = {
        apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
        authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
        projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
        storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
        recaptchaSiteKey: "NEXT_PUBLIC_RECAPTCHA_SITE_KEY",
    };
    const missingVarNames = missingKeys.map(key => keyMap[key as keyof typeof keyMap]).join(', ');
    throw new Error(`Firebase configuration is missing or invalid. Please check your .env.local file for the following required environment variables: ${missingVarNames}. You can find these values in your Firebase project settings.`);
}


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

// Set persistence on the client side based on user's last choice
if (typeof window !== "undefined") {
    const rememberMe = JSON.parse(localStorage.getItem('rememberMe') || 'true');
    const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
    setPersistence(auth, persistence)
      .catch((error) => {
        console.error("Firebase persistence error:", error);
      });
}

// Initialize App Check only on the client side, and only in production
if (typeof window !== "undefined" && process.env.NODE_ENV === 'production') {
  initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!),
    isTokenAutoRefreshEnabled: true,
  });
}

const db = getFirestore(app);
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export { app, db, auth, messaging };
