"use client";

import { Button } from "@/components/ui/button";

function BellIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.25 18.75a2.25 2.25 0 0 1-4.5 0m8.25-3.75V10a6 6 0 1 0-12 0v5l-1.5 1.5v.75h15v-.75L18 15Z"
      />
    </svg>
  );
}

type BellButtonProps = {
  isOpen: boolean;
  onClick: () => void;
  unreadCount: number;
};

export function BellButton({ isOpen, onClick, unreadCount }: BellButtonProps) {
  return (
    <Button
      variant="pill"
      size="pill"
      className="relative h-8 px-2 sm:h-9 sm:px-3"
      aria-label={`通知，${unreadCount} 則明日賽程`}
      aria-expanded={isOpen}
      aria-haspopup="menu"
      onClick={onClick}
    >
      <BellIcon />
      {unreadCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex min-w-4 items-center justify-center rounded-full bg-[#e11d48] px-1 text-[10px] font-semibold leading-4 text-white">
          {unreadCount}
        </span>
      ) : null}
    </Button>
  );
}
