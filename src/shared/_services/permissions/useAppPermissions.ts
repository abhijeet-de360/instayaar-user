import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { Geolocation } from "@capacitor/geolocation";

export const requestAppPermissions = async () => {
  console.log("🔐 Starting permission flow");

  /* ================= NOTIFICATIONS ================= */

  if (Capacitor.isNativePlatform()) {
    const notifStatus = await PushNotifications.checkPermissions();

    if (notifStatus.receive !== "granted") {
      const perm = await PushNotifications.requestPermissions();

      if (perm.receive === "granted") {
        await PushNotifications.register();
        console.log("✅ Native notification granted");
      } else {
        console.warn("❌ Native notification denied");
      }
    }
  } else {
    // 🌐 WEB NOTIFICATIONS
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
    }
  }

  /* ================= LOCATION ================= */

  if (Capacitor.isNativePlatform()) {
    const locStatus = await Geolocation.checkPermissions();

    if (locStatus.location !== "granted") {
      await Geolocation.requestPermissions();
    }
  } else {
    // 🌐 WEB LOCATION (request happens on first getCurrentPosition)
    console.log("🌐 Web location handled by browser");
  }
};
