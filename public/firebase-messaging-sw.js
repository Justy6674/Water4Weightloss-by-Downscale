
// This service worker file is required for background push notifications.

// Scripts for Firebase products are imported on-demand.
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration.
// These keys are intended to be public for client-side use.
const firebaseConfig = {
  apiKey: "AIzaSyAvomIk-8jXk_NJP4NJBNZ50KBRQ6M3Des",
  authDomain: "water4weightloss-by-downscale.firebaseapp.com",
  projectId: "water4weightloss-by-downscale",
  storageBucket: "water4weightloss-by-downscale.appspot.com",
  messagingSenderId: "820622158878",
  appId: "1:820622158878:web:4dba334d369bbb708a520f"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// The service worker doesn't do anything else with the messaging object,
// but it does need to be initialized.
