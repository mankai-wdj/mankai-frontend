// import firebase from 'firebase/app'
// import 'firebase/messaging'
importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-messaging.js');
const config =  { 
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: "mankai-project.firebaseapp.com",
    projectId: "mankai-project",
    storageBucket: "mankai-project.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
}; 
firebase.initializeApp(config);

const initMessaging = firebase.messaging()

// initMessaging.onBackgroundMessage((payload) => {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//       body: 'Background Message body.',
//       icon: '/firebase-logo.png'
//     };
  
//     initMessaging.registration.showNotification(notificationTitle,
//       notificationOptions);
//   });