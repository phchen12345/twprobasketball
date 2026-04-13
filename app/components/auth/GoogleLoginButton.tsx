"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
          }) => void;
          prompt: (
            callback?: (notification: {
              isDisplayed: () => boolean;
              isNotDisplayed: () => boolean;
              isSkippedMoment: () => boolean;
            }) => void,
          ) => void;
        };
      };
    };
  }
}

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

export function GoogleLoginButton() {
  const { loginWithGoogle } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setError("尚未設定 Google 登入");
      return;
    }

    const googleClientId = clientId;

    function initializeGoogleLogin() {
      if (!window.google) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response) => {
          if (!response.credential) {
            setIsPending(false);
            setError("Google 登入失敗");
            return;
          }

          void loginWithGoogle(response.credential)
            .catch(() => {
              setError("登入驗證失敗");
            })
            .finally(() => {
              setIsPending(false);
            });
        },
      });

      setIsReady(true);
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${GOOGLE_SCRIPT_SRC}"]`,
    );

    if (existingScript) {
      if (window.google) {
        initializeGoogleLogin();
      } else {
        existingScript.addEventListener("load", initializeGoogleLogin, {
          once: true,
        });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleLogin;
    script.onerror = () => setError("無法載入 Google 登入");
    document.head.appendChild(script);
  }, [loginWithGoogle]);

  function handleGoogleLogin() {
    if (!window.google || !isReady) {
      setError("Google 登入尚未準備完成");
      return;
    }

    setError(null);
    setIsPending(true);

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        setIsPending(false);
        setError("請允許瀏覽器顯示 Google 登入視窗");
      }
    });
  }

  if (error) {
    return (
      <Button
        variant="google"
        size="google"
        className="text-[11px] font-semibold uppercase tracking-[0.14em]"
        onClick={() => setError(null)}
      >
        {error}
      </Button>
    );
  }

  return (
    <Button
      variant="google"
      size="google"
      className="text-[11px] font-semibold uppercase tracking-[0.14em]"
      disabled={!isReady || isPending}
      onClick={handleGoogleLogin}
    >
      {isPending ? "登入中" : "登入 / 註冊"}
    </Button>
  );
}
