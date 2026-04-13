"use client";

import { useEffect, useState } from "react";
import { Eye, LoaderCircle } from "lucide-react";

const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL?.replace(/\/$/, "");
const VISITOR_API_URL = BACKEND_API_BASE_URL
  ? `${BACKEND_API_BASE_URL}/api/visitors/increment`
  : undefined;
const VISITOR_READ_API_URL = BACKEND_API_BASE_URL
  ? `${BACKEND_API_BASE_URL}/api/visitors`
  : undefined;
const VISITOR_COOLDOWN_KEY = "twprobasketball_last_visit_at";
const VISITOR_COOLDOWN_MS = 30 * 60 * 1000;

type CounterResponse = {
  totalVisits: number;
  updatedAt: string | null;
};

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadVisitorCount() {
      try {
        if (!VISITOR_API_URL || !VISITOR_READ_API_URL) {
          throw new Error("Visitor API URL is not configured");
        }

        const lastVisitAt = window.localStorage.getItem(VISITOR_COOLDOWN_KEY);
        const now = Date.now();
        const shouldIncrement =
          !lastVisitAt || now - Number(lastVisitAt) >= VISITOR_COOLDOWN_MS;

        const response = await fetch(shouldIncrement ? VISITOR_API_URL : VISITOR_READ_API_URL, {
          method: shouldIncrement ? "POST" : "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Counter request failed with ${response.status}`);
        }

        const data = (await response.json()) as CounterResponse;

        if (!cancelled) {
          setCount(data.totalVisits);
          setHasError(false);

          if (shouldIncrement) {
            window.localStorage.setItem(VISITOR_COOLDOWN_KEY, String(now));
          }
        }
      } catch {
        if (!cancelled) {
          setHasError(true);
        }
      }
    }

    void loadVisitorCount();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      <div className="min-w-[132px] rounded-xl border border-white/15 bg-[#0b0d12]/88 px-3 py-2.5 text-white shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
          <Eye className="h-3.5 w-3.5" />
          訪問人數
        </div>

        <div className="mt-2 flex items-end gap-2">
          {count === null && !hasError ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin text-white/70" />
              <span className="text-xs text-white/70">讀取中</span>
            </>
          ) : hasError ? (
            <span className="text-xs text-white/70">暫時無法取得</span>
          ) : (
            <>
              <span className="text-xl font-semibold leading-none text-white">
                {count?.toLocaleString("zh-TW")}
              </span>
              <span className="text-xs text-white/60">人次</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
