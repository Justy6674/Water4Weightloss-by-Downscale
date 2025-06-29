
// This file must be in the public folder.
// It needs to be a vanilla JavaScript file, not TypeScript.

// Import the Firebase app and messaging services
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Your web app's Firebase configuration.
// This is public data and it's safe to be here.
// It's REQUIRED for the service worker to know which Firebase project to connect to.
const firebaseConfig = {
  apiKey: "AIzaSyAvomIk-8jXk_NJP4NJBNZ50KBRQ6M3Des",
  authDomain: "water4weightloss-by-downscale.firebaseapp.com",
  projectId: "water4weightloss-by-downscale",
  storageBucket: "water4weightloss-by-downscale.appspot.com",
  messagingSenderId: "820622158878",
  appId: "1:820622158878:web:4dba334d369bbb708a520f"
};

// Initialize the Firebase app in the service worker
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// This handler will be triggered when the app is in the background or closed.
onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png' // Or your preferred icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
