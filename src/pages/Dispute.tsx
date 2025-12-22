import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

const Dispute: React.FC = () => {
  const [showMobileAuth, setShowMobileAuth] = useState(false);
  const handleMobileProfileClick = () => setShowMobileAuth(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (document.getElementById("tawkScript")) return;

    window.Tawk_LoadStart = new Date();
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_API.embedded = "tawk_6910c132edad88195eb78a50"; // 🔄 Updated

    const s1 = document.createElement("script");
    s1.id = "tawkScript";
    s1.async = true;
    s1.src = "https://embed.tawk.to/6910c132edad88195eb78a50/1j9ucf0nh"; // 🔄 Updated
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    const s0 = document.getElementsByTagName("script")[0];
    s0.parentNode?.insertBefore(s1, s0);

    s1.onload = () => {
      const Tawk = window.Tawk_API;
      if (!Tawk) return;

      Tawk.onLoad = function () {
        console.log("Embedded Tawk chat loaded");

        Tawk.setAttributes(
          {
            name: "John Doe",
            email: "john@example.com",
          },
          (error: any) => {
            if (error) console.error("Tawk error:", error);
          }
        );

        Tawk.addEvent("dispute_initiated", {
          message: "User opened dispute chat page.",
        });

        setTimeout(() => {
          const iframe = document.querySelector(
            "iframe[id^='tawk']"
          ) as HTMLIFrameElement;

          if (iframe?.contentWindow) {
            iframe.contentWindow.postMessage(
              {
                type: "visitorMessage",
                message:
                  "Hi, I’d like to raise a dispute regarding my recent booking.",
              },
              "*"
            );
          }
        }, 1500);
      };
    };
  }, []);

  return (
    <div className="">
      <div
        className=" flex items-center bg-primary text-white font-medium h-[60px] px-4 gap-3"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft />
        Back
      </div>

      {/* 🔄 Updated container ID */}
      <div
        id="tawk_6910c132edad88195eb78a50"
        style={{
          width: "100%",
          height: "calc(100dvh - 60px)",
          border: "",
          borderRadius: "0px",
          overflow: "hidden",
        }}
      ></div>

      {/* <MobileBottomNav onProfileClick={handleMobileProfileClick} /> */}
    </div>
  );
};

export default Dispute;
