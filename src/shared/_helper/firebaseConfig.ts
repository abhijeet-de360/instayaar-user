import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyAhNWrx617viVyOlIiih3agWNzVVk17uZI",
    authDomain: "kaamdham-f4771.firebaseapp.com",
    projectId: "kaamdham-f4771",
    storageBucket: "kaamdham-f4771.firebasestorage.app",
    messagingSenderId: "521245498217",
    appId: "1:521245498217:web:2c3f0c3ab786112460bbf8",
    measurementId: "G-7TW5RDXCDB"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);