"use client";

import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { AuthMenu } from "../auth/AuthMenu";
import { ActiveNav } from "../schedule/scheduleTypes";

type Props = {
  isPastAnimation: boolean;
  activeNav: ActiveNav;
};

export default function ScrollHeader({ isPastAnimation, activeNav }: Props) {
  const items = [
    { href: "#plg-schedule", label: "PLG 賽程", active: activeNav === "plg" },
    {
      href: "#tpbl-schedule",
      label: "TPBL 賽程",
      active: activeNav === "tpbl",
    },
    { href: "#bcl-schedule", label: "BCL 賽程", active: activeNav === "bcl" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        className={`transition-all duration-500 ease-out ${isPastAnimation ? "pt-3" : "pt-2"}`}
      >
        <div
          className={
            isPastAnimation
              ? "mx-2 flex w-[calc(100%-1rem)] min-w-0 items-center justify-between gap-1.5 rounded-[1.25rem] border border-white/10 bg-[#0f1117]/88 px-2 py-2 text-white shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-500 ease-out sm:mx-auto sm:w-[calc(100%-2rem)] sm:max-w-3xl sm:gap-3 sm:px-4 lg:w-fit lg:max-w-max"
              : "mx-2 flex min-w-0 items-center justify-between gap-1.5 rounded-[1.25rem] border border-white/10 bg-[#0b0d12]/82 px-2 py-2 text-white shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-500 ease-out sm:mx-4 sm:gap-3 sm:px-3 lg:mx-6 lg:rounded-[1.5rem] lg:px-3 lg:py-2.5"
          }
        >
          <a
            href="#"
            className={
              isPastAnimation
                ? "block w-[30px] shrink-0 transition-all duration-500 ease-out sm:w-[44px]"
                : "block w-[34px] shrink-0 transition-all duration-500 ease-out sm:w-[56px] lg:w-[76px]"
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
                ? "flex min-w-0 flex-1 items-center justify-center gap-1 overflow-hidden transition-all duration-500 ease-out sm:gap-2"
                : "ml-auto flex min-w-0 flex-1 items-center justify-center gap-1 overflow-hidden transition-all duration-500 ease-out sm:gap-2 lg:flex-none lg:justify-end"
            }
          >
            {items.map((item) => (
              <a key={item.href} href={item.href}>
                <Button
                  variant={item.active ? "accent" : "pill"}
                  size="pill"
                  className={`h-8 px-2 text-[9px] uppercase tracking-[0.08em] sm:h-9 sm:px-3 sm:text-[11px] sm:tracking-[0.14em] ${
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

          <AuthMenu />
        </div>
      </div>
    </header>
  );
}
