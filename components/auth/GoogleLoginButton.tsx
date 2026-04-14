"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";

type TokenClient = {
  requestAccessToken: () => void;
};

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (options: {
            client_id: string;
            scope: string;
            callback: (response: { access_token?: string; error?: string }) => void;
          }) => TokenClient;
        };
      };
    };
  }
}

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

export function GoogleLoginButton() {
  const { loginWithGoogle } = useAuth();
  const tokenClientRef = useRef<TokenClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setError("尚未設定");
      return;
    }

    const googleClientId = clientId;

    function initializeGoogleLogin() {
      if (!window.google?.accounts.oauth2) {
        return;
      }

      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: "openid email profile",
        callback: (response) => {
          if (!response.access_token || response.error) {
            setIsPending(false);
            setError("登入失敗");
            return;
          }

          void loginWithGoogle(response.access_token)
            .catch(() => {
              setError("驗證失敗");
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
        existingScript.addEventListener("load", initializeGoogleLogin, { once: true });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleLogin;
    script.onerror = () => setError("載入失敗");
    document.head.appendChild(script);
  }, [loginWithGoogle]);

  function handleGoogleLogin() {
    if (!tokenClientRef.current || !isReady) {
      setError("尚未就緒");
      return;
    }

    setError(null);
    setIsPending(true);
    tokenClientRef.current.requestAccessToken();
  }

  if (error) {
    return (
      <Button
        variant="google"
        size="google"
        className="h-8 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] sm:h-9 sm:px-4 sm:text-[11px] sm:tracking-[0.14em]"
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
      className="h-8 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] sm:h-9 sm:px-4 sm:text-[11px] sm:tracking-[0.14em]"
      disabled={!isReady || isPending}
      onClick={handleGoogleLogin}
    >
      {isPending ? "登入中" : "登入"}
    </Button>
  );
}
