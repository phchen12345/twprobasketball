import { NextRequest, NextResponse } from "next/server";

const TPBL_API_URL = process.env.TPBL_API_URL;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 30;
const UPSTREAM_TIMEOUT_MS = 8_000;
const RESPONSE_CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=300";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

function applyRateLimit(key: string) {
  const now = Date.now();

  for (const [storedKey, entry] of rateLimitStore) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(storedKey);
    }
  }

  const current = rateLimitStore.get(key);

  if (!current || current.resetAt <= now) {
    const nextEntry = {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    };
    rateLimitStore.set(key, nextEntry);
    return nextEntry;
  }

  current.count += 1;
  rateLimitStore.set(key, current);
  return current;
}

function buildHeaders(remaining: number, resetAt: number) {
  return {
    "Cache-Control": RESPONSE_CACHE_CONTROL,
    "X-RateLimit-Limit": String(RATE_LIMIT_MAX_REQUESTS),
    "X-RateLimit-Remaining": String(Math.max(0, remaining)),
    "X-RateLimit-Reset": String(Math.ceil(resetAt / 1000)),
  };
}

export async function GET(request: NextRequest) {
  if (!TPBL_API_URL) {
    return NextResponse.json(
      { error: "TPBL_API_URL is not configured" },
      { status: 500 },
    );
  }

  const clientIp = getClientIp(request);
  const rateLimit = applyRateLimit(clientIp);
  const remaining = RATE_LIMIT_MAX_REQUESTS - rateLimit.count;
  const rateLimitHeaders = buildHeaders(remaining, rateLimit.resetAt);

  if (rateLimit.count > RATE_LIMIT_MAX_REQUESTS) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          ...rateLimitHeaders,
          "Retry-After": String(Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000))),
        },
      },
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const response = await fetch(TPBL_API_URL, {
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `TPBL API request failed with ${response.status}` },
        {
          status: response.status,
          headers: rateLimitHeaders,
        },
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      status: 200,
      headers: rateLimitHeaders,
    });
  } catch (error) {
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "TPBL API request timed out"
        : "Failed to fetch TPBL games";

    return NextResponse.json(
      { error: message },
      {
        status: 500,
        headers: rateLimitHeaders,
      },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}
