
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

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);

// Set persistence on the client side based on user's last choice
if (typeof window !== "undefined") {
    try {
        const rememberMe = JSON.parse(localStorage.getItem('rememberMe') || 'true');
        const persistence = rememberMe ? browserLocalPersistence : browserSessionPersistence;
        setPersistence(auth, persistence);
    } catch (error) {
        console.error("Firebase persistence error:", error);
    }
}

// Initialize App Check only on the client side
if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY),
      isTokenAutoRefreshEnabled: true,
    });
  } catch (error) {
    console.error("Firebase App Check initialization error:", error);
  }
}

const db = getFirestore(app);
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export { app, db, auth, messaging };
