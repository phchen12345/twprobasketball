"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthProvider";
import { GoogleLoginButton } from "./GoogleLoginButton";

export function AuthMenu() {
  const { user, isLoading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (isLoading) {
    return (
      <Button
        variant="pill"
        size="pill"
        className="h-8 px-2 text-[10px] sm:h-9 sm:px-3 sm:text-[11px]"
      >
        載入中
      </Button>
    );
  }

  if (!user) {
    return <GoogleLoginButton />;
  }

  return (
    <div ref={menuRef} className="relative shrink-0">
      <Button
        variant="pill"
        size="pill"
        className="h-8 gap-2 px-2 sm:h-9 sm:px-3"
        aria-label={user.name || user.email}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((current) => !current)}
      >
        {user.avatarUrl ? (
          <NextImage
            src={user.avatarUrl}
            alt={user.name || user.email}
            width={24}
            height={24}
            className="size-6 rounded-full"
          />
        ) : (
          <span className="text-[10px] font-semibold uppercase">
            {(user.name || user.email).slice(0, 1)}
          </span>
        )}
        <span className="hidden max-w-[104px] truncate text-[11px] uppercase tracking-[0.14em] lg:inline">
          {user.name || user.email}
        </span>
      </Button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-44 rounded-lg border border-white/15 bg-[#0f1117]/95 p-1.5 text-white shadow-[0_18px_48px_rgba(0,0,0,0.3)] backdrop-blur-xl"
        >
          <div className="truncate px-2 py-1.5 text-xs text-white/65">
            {user.email}
          </div>
          <Link href="/my-teams" className="block">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 w-full justify-start px-2 text-xs"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              我的球隊
            </Button>
          </Link>
          {user.role === "admin" ? (
            <Link href="/admin" className="block">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 w-full justify-start px-2 text-xs"
                role="menuitem"
                onClick={() => setIsOpen(false)}
              >
                管理後台
              </Button>
            </Link>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-full justify-start px-2 text-xs"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              void logout();
            }}
          >
            登出
          </Button>
        </div>
      ) : null}
    </div>
  );
}
