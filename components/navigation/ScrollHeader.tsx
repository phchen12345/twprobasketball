"use client";

import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { AuthMenu } from "../auth/AuthMenu";
import { TeamNotificationsMenu } from "@/features/notifications/components/TeamNotificationsMenu";
import { ActiveNav } from "@/features/schedule/components/types/scheduleTypes";

type Props = {
  isPastAnimation: boolean;
  activeNav: ActiveNav;
};

export default function ScrollHeader({ isPastAnimation, activeNav }: Props) {
  const items = [
    { href: "#plg-schedule", label: "PLG 鞈賜?", active: activeNav === "plg" },
    {
      href: "#tpbl-schedule",
      label: "TPBL 鞈賜?",
      active: activeNav === "tpbl",
    },
    { href: "#bcl-schedule", label: "BCL 鞈賜?", active: activeNav === "bcl" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={`transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${isPastAnimation ? "pt-3" : "pt-2"}`}
      >
        <div
          className={`mx-auto flex min-w-0 items-center justify-center border border-white/10 bg-[#0f1117]/88 text-white shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-[width,max-width,border-radius,background-color,box-shadow,padding,transform,gap] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isPastAnimation
              ? "w-[calc(100%-1rem)] max-w-[29rem] justify-between gap-1 rounded-[1.25rem] px-1.5 py-2 sm:gap-2 sm:px-2.5"
              : "w-[calc(100%-1rem)] max-w-[30rem] gap-1.5 rounded-[1.25rem] px-1.5 py-2 sm:max-w-none sm:justify-between sm:gap-3 sm:bg-[#0b0d12]/82 sm:px-3 sm:shadow-[0_18px_48px_rgba(0,0,0,0.22)] lg:rounded-[1.5rem] lg:py-2.5"
          }`}
        >
          <a
            href="#"
            className={
              isPastAnimation
                ? "block w-[30px] shrink-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-[38px]"
                : "block w-[34px] shrink-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:w-[56px] lg:w-[76px]"
            }
          >
            <NextImage
              src="/web_newlogo.webp"
              alt="JASPER logo"
              className="h-auto w-full object-contain"
              width={512}
              height={512}
              priority
            />
          </a>

          <nav
            className={
              isPastAnimation
                ? "flex min-w-0 flex-1 items-center justify-between gap-1 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:gap-1.5"
                : "ml-auto flex min-w-0 flex-1 items-center justify-center gap-1 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:gap-2 lg:flex-none lg:justify-end"
            }
          >
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={isPastAnimation ? "min-w-0 flex-1" : ""}
              >
                <Button
                  variant={item.active ? "accent" : "pill"}
                  size="pill"
                  className={`uppercase tracking-[0.08em] sm:tracking-[0.14em] ${
                    isPastAnimation
                      ? "h-8 w-full px-1 text-[9px] sm:h-9 sm:px-2 sm:text-[11px]"
                      : "h-8 px-2 text-[9px] sm:h-9 sm:px-3 sm:text-[11px]"
                  } ${
                    item.active
                      ? "bg-white text-black shadow-[0_10px_28px_rgba(255,255,255,0.18)] hover:bg-white/90"
                      : ""
                  }`}
                >
                  {item.label}
                </Button>
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <TeamNotificationsMenu isCompact={isPastAnimation} />
            <AuthMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
