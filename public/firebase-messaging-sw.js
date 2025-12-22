// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyD4TbmzQWIqt14KkHvkINez7gWNXDmSC8U",
    authDomain: "instayaar-9d0d1.firebaseapp.com",
    projectId: "instayaar-9d0d1",
    storageBucket: "instayaar-9d0d1.firebasestorage.app",
    messagingSenderId: "1085645691962",
    appId: "1:1085645691962:web:c08d55f3e4b3bb8e17a903",
    measurementId: "G-QKLEF6DZGF"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});