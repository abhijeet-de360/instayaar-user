import { Capacitor } from '@capacitor/core';
import { getToken } from "firebase/messaging";
import { messaging } from "./firebaseConfig";
import { PushNotifications } from "@capacitor/push-notifications";

const vapidKey = "BL7jfQo4-Yp_rEJLSxl6CNj9li2fnn8b19J292LfMQY88aNzoMdGOfarzVjjZlkpEF1Dh4yOsxHfphlA9KznNME";

export async function getFCMToken(): Promise<string | null> {
  if (Capacitor.isNativePlatform()) {
    try {
      const permissionStatus = await PushNotifications.requestPermissions();
      if (permissionStatus.receive !== 'granted') {
        return null;
      }
      return new Promise((resolve) => {
        PushNotifications.register();
        PushNotifications.addListener('registration', token => {
          resolve(token.value);
        });
        PushNotifications.addListener('registrationError', err => {
          resolve(null);
        });
      });
    } catch (err) {
      return null;
    }
  } else {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await getToken(messaging, { vapidKey });
        return token;
      } else {
        return null;
      }
    } catch (err) {
      return null;
    }
  }
}