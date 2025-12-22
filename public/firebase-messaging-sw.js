// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAhNWrx617viVyOlIiih3agWNzVVk17uZI",
    authDomain: "kaamdham-f4771.firebaseapp.com",
    projectId: "kaamdham-f4771",
    storageBucket: "kaamdham-f4771.firebasestorage.app",
    messagingSenderId: "521245498217",
    appId: "1:521245498217:web:2c3f0c3ab786112460bbf8",
    measurementId: "G-7TW5RDXCDB"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});