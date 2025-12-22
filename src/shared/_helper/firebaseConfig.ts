import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyD4TbmzQWIqt14KkHvkINez7gWNXDmSC8U",
    authDomain: "instayaar-9d0d1.firebaseapp.com",
    projectId: "instayaar-9d0d1",
    storageBucket: "instayaar-9d0d1.firebasestorage.app",
    messagingSenderId: "1085645691962",
    appId: "1:1085645691962:web:c08d55f3e4b3bb8e17a903",
    measurementId: "G-QKLEF6DZGF"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);