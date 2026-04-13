"use client";

import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";
import { GoogleLoginButton } from "./GoogleLoginButton";

export function AuthMenu() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <Button variant="pill" size="pill" className="h-9 px-3 text-[11px]">
        載入中
      </Button>
    );
  }

  if (!user) {
    return <GoogleLoginButton />;
  }

  return (
    <div className="flex items-center gap-2">
      {user.avatarUrl ? (
        <NextImage
          src={user.avatarUrl}
          alt={user.name || user.email}
          width={28}
          height={28}
          className="h-7 w-7 rounded-full"
        />
      ) : null}
      <span className="hidden max-w-[120px] truncate text-xs text-white/80 sm:inline">
        {user.name || user.email}
      </span>
      <Button
        variant="pill"
        size="pill"
        className="h-9 px-3 text-[11px]"
        onClick={logout}
      >
        登出
      </Button>
    </div>
  );
}
