"use client";

import NextImage from "next/image";
import topBarLogoImage from "../../Logo2.jpg";
import { ActiveNav } from "./scheduleTypes";

type Props = {
  isPastAnimation: boolean;
  activeNav: ActiveNav;
};

export default function ScrollHeader({ isPastAnimation, activeNav }: Props) {
  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className={`transition-all duration-500 ease-out ${isPastAnimation ? "pt-2" : "pt-0"}`}>
        <div
          className={
            isPastAnimation
              ? "mx-auto flex w-[calc(100%-1rem)] max-w-max scale-90 items-center justify-between gap-3 rounded-xl bg-[#1a1a1a] px-3 py-2 text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition-all duration-500 ease-out sm:w-fit sm:gap-6 sm:px-5"
              : "flex w-full scale-100 items-center justify-between gap-3 bg-black px-3 py-2.5 transition-all duration-500 ease-out sm:px-4 lg:px-6"
          }
        >
          <a
            href="#"
            className={
              isPastAnimation
                ? "block w-[42px] shrink-0 transition-all duration-500 ease-out sm:w-[52px]"
                : "block w-[56px] shrink-0 transition-all duration-500 ease-out sm:w-[77px] lg:w-[91px]"
            }
          >
            <NextImage
              src={topBarLogoImage}
              alt="JASPER logo"
              className="h-auto w-full object-contain"
              priority
            />
          </a>

          <nav
            className={
              isPastAnimation
                ? "flex min-w-0 items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-100 transition-all duration-500 ease-out sm:gap-7 sm:text-[11px]"
                : "ml-auto flex min-w-0 items-center gap-3 text-[10px] uppercase tracking-[0.14em] text-zinc-300 transition-all duration-500 ease-out sm:gap-6 sm:text-xs md:gap-10 md:text-sm"
            }
          >
            <a
              href="#plg-schedule"
              className={`transition hover:text-white ${activeNav === "plg" ? "text-[#BB986C]" : ""}`}
            >
              PLG 賽程
            </a>
            <a
              href="#tpbl-schedule"
              className={`transition hover:text-white ${activeNav === "tpbl" ? "text-[#BB986C]" : ""}`}
            >
              TPBL 賽程
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
