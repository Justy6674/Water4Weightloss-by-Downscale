// DO NOT USE import/export syntax, this file is a service worker
// and is not part of the normal Next.js build pipeline.

// Import the functions you need from the SDKs you need
self.importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
self.importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// Your web app's Firebase configuration
// This is public and safe to be here. It's required for the background
// service to identify your project to Google's push service.
const firebaseConfig = {
  apiKey: "AIzaSyAvomIk-8jXk_NJP4NJBNZ50KBRQ6M3Des",
  authDomain: "water4weightloss-by-downscale.firebaseapp.com",
  projectId: "water4weightloss-by-downscale",
  storageBucket: "water4weightloss-by-downscale.appspot.com",
  messagingSenderId: "820622158878",
  appId: "1:820622158878:web:4dba334d369bbb708a520f"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle incoming messages when the app is in the background
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );

  // Customize the notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png', // Or your preferred icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
