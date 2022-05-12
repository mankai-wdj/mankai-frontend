// import firebase from 'firebase/app'
// import 'firebase/messaging'
importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.2.3/firebase-messaging.js')
const config = {
  apiKey: 'AIzaSyBecxWiGZMPCfagqeh1CJO41uHIomGbM5g',
  authDomain: 'mankai-project.firebaseapp.com',
  projectId: 'mankai-project',
  storageBucket: 'mankai-project.appspot.com',
  messagingSenderId: 860929381621,
  appId: '1:860929381621:web:9f918af7be472bf022a1bc',
  measurementId: 'G-3C4RS2WTH6',
}
firebase.initializeApp(config)

if (firebase.messaging.isSupported()) {
  const initMessaging = firebase.messaging()
}
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
