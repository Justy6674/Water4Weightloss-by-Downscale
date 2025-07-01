// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
// This is a PUBLIC value, so it's safe to be here.
const firebaseConfig = {
  apiKey: "AIzaSyAvomIk-8jXk_NJP4NJBNZ50KBRQ6M3Des",
  authDomain: "water4weightloss-by-downscale.firebaseapp.com",
  projectId: "water4weightloss-by-downscale",
  storageBucket: "water4weightloss-by-downscale.firebasestorage.app",
  messagingSenderId: "820622158878",
  appId: "1:820622158878:web:4dba334d369bbb708a520f",
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/favicon 192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
