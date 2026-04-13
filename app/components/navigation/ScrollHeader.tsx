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
              ? "mx-auto flex w-[calc(100%-1rem)] max-w-max scale-95 items-center justify-between gap-3 rounded-[1.25rem] border border-white/10 bg-[#0f1117]/88 px-3 py-2 text-white shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-500 ease-out sm:w-fit sm:gap-4 sm:px-4"
              : "mx-3 flex items-center justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-[#0b0d12]/82 px-3 py-2.5 text-white shadow-[0_18px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-500 ease-out sm:mx-4 lg:mx-6"
          }
        >
          <a
            href="#"
            className={
              isPastAnimation
                ? "block w-[36px] shrink-0 transition-all duration-500 ease-out sm:w-[44px]"
                : "block w-[48px] shrink-0 transition-all duration-500 ease-out sm:w-[64px] lg:w-[76px]"
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
                ? "flex min-w-0 items-center gap-2 transition-all duration-500 ease-out sm:gap-3"
                : "ml-auto flex min-w-0 items-center gap-2 transition-all duration-500 ease-out sm:gap-3"
            }
          >
            {items.map((item) => (
              <a key={item.href} href={item.href}>
                <Button
                  variant={item.active ? "accent" : "pill"}
                  size="pill"
                  className={`h-9 px-3 text-[10px] uppercase tracking-[0.14em] sm:text-[11px] ${
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
