
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Developer-friendly error if any key is missing
const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value || value.includes("YOUR_"))
  .map(([key]) => key);

if (missingKeys.length > 0) {
    const keyMap = {
        apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
        authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
        projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
        storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
        messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
        appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
        measurementId: "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
    };
    const missingVarNames = missingKeys.map(key => keyMap[key as keyof typeof keyMap]).join(', ');
    throw new Error(`Firebase configuration is missing or invalid. Please check your .env.local file for the following environment variables: ${missingVarNames}. You can find these values in your Firebase project settings under "Web app" configuration.`);
}


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
