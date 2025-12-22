// src/components/IncomingBookingModal.tsx
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";

type Payload = {
  title?: string;
  budget?: number | string;
  jobId?: string;
  [key: string]: any;
};

type Props = {
  visible: boolean;
  payload?: Payload | null;
  onAccept: (payload?: Payload) => void;
  onReject: (payload?: Payload) => void;
  timeoutMs?: number; // auto-dismiss timeout
};

export default function IncomingBookingModal({
  visible,
  payload,
  onAccept,
  onReject,
  timeoutMs = 30000,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const vibrateIntervalRef = useRef<number | null>(null);

  // load ringtone & prepare audio
  useEffect(() => {
    if (!visible) return;

    // create audio element
    const audio = new Audio("/notification.mp3"); // put ringtone in /public
    audio.loop = true;
    audioRef.current = audio;

    // try playing (may be blocked on web until user gesture)
    audio.play().catch(() => {
      // silent fail — user gesture may be required on web
      // we will still attempt vibration
    });

    // vibration/haptics
    const vibrate = () => {
      try {
        if (Capacitor.isNativePlatform()) {
          Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {});
        } else if (navigator.vibrate) {
          navigator.vibrate([300, 200, 300]);
        }
      } catch (e) {
        // ignore
      }
    };

    vibrate(); // one immediate
    // repeat vibration every 2.5s while visible
    vibrateIntervalRef.current = window.setInterval(vibrate, 2500);

    // auto-dismiss timeout
    timeoutRef.current = window.setTimeout(() => {
      onReject(payload ?? undefined); // auto reject when timeout
    }, timeoutMs);

    return () => {
      // cleanup
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (vibrateIntervalRef.current) {
        clearInterval(vibrateIntervalRef.current);
        vibrateIntervalRef.current = null;
      }
      // stop vibration on supported browsers
      try {
        if (navigator.vibrate) navigator.vibrate(0);
      } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible || !payload) return null;

  return (
    // fullscreen overlay
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">Instant Booking Request</h3>

        <p className="text-sm text-muted-foreground mb-4">
          {payload.title || "New request"}
        </p>

        <div className="mb-4">
          <div className="text-2xl font-bold">
            {payload.budget ? `₹${payload.budget}` : ""}
          </div>
          {payload.jobId && (
            <div className="text-xs text-muted-foreground mt-1">
              Job ID: {payload.jobId}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            className="w-1/2"
            variant="destructive"
            onClick={() => {
              // stop audio before calling back
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
              }
              // clear timeout/vibration
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
              if (vibrateIntervalRef.current) {
                clearInterval(vibrateIntervalRef.current);
                vibrateIntervalRef.current = null;
              }
              onReject(payload);
            }}
          >
            Reject
          </Button>

          <Button
            className="w-1/2"
            onClick={() => {
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
              }
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
              if (vibrateIntervalRef.current) {
                clearInterval(vibrateIntervalRef.current);
                vibrateIntervalRef.current = null;
              }
              onAccept(payload);
            }}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
