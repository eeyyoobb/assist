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
  const [user, setUser] = useState<User>(() => {
    if (
      typeof window !== "undefined" &&
      window.Telegram?.WebApp?.initDataUnsafe?.user
    ) {
      const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
      return {
        id: String(tgUser.id),
        first_name: tgUser.first_name,
        username: tgUser.username,
      };
    }
    return GUEST_USER;
  });

  // 2. Initialize Loading synchronously (Fixes the current error)
  // We only set loading to 'true' if we are actually in Telegram and have data to verify.
  const [loading, setLoading] = useState(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp?.initData) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.ready();
      tg.expand();

      // 3. Only fetch if we have data. If we don't, loading is already false.
      if (tg.initData) {
        fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ initData: tg.initData }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data && !data.error) setUser(data);
          })
          .catch((err) => console.error("Auth sync failed:", err))
          .finally(() => {
            setLoading(false); // This is now safe because it's inside an async callback
          });
      }
    }
    // No 'else { setLoading(false) }' needed here anymore!
  }, []);

  return (
    <main className="min-h-screen">
      {/* Visual cue that we are verifying the user in the background */}
      {loading && (
        <div className="fixed bottom-4 right-4 animate-pulse text-xs text-gray-400">
          Verifying Session...
        </div>
      )}
      <ReportPage user={user} />
    </main>
  );
};

export default Index;
