"use client";

import { useEffect, useState } from "react";
import ReportPage from "./components/report";
import { WebApp } from "@twa-dev/types";

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp;
    };
  }
}

export type User = {
  id: string;
  first_name?: string;
  username?: string;
};

export const GUEST_USER: User = {
  id: "guest",
  first_name: "Guest",
  username: "guest_user",
};

const Index = () => {
  // 1. Initialize User synchronously (Fixes the first error)
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const initData = tg.initData || "";
      const initDataUnsafe = tg.initDataUnsafe || {};

      if (initDataUnsafe.user) {
        fetch("/api/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(initDataUnsafe.user),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setError(data.error);
            } else {
              setUser(data);
            }
          })
          .catch((err) => {
            setError("Failed to fetch user data");
          });
      } else {
        setError("No user data available");
      }
    } else {
      setError("This app should be opened in Telegram");
    }
  }, []);

  return (
    <main className="min-h-screen">
      <ReportPage user={user} />
    </main>
  );
};

export default Index;
