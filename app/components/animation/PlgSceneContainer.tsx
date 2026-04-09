"use client";

import { ReactNode, RefObject } from "react";

type Props = {
  contentSectionRef: RefObject<HTMLDivElement | null>;
  backgroundReveal: number;
  isTpblSectionActive: boolean;
  isPastAnimation: boolean;
  children: ReactNode;
};

export default function PlgSceneContainer({
  contentSectionRef,
  backgroundReveal,
  isTpblSectionActive,
  isPastAnimation,
  children,
}: Props) {
  const isPlgBackgroundComplete = backgroundReveal >= 0.999;
  const plgBackgroundClass = isPlgBackgroundComplete ? "bg-[#BB986C]" : "bg-zinc-200";

  return (
    <div
      ref={contentSectionRef}
      id="plg-schedule"
      className={`relative overflow-hidden ${isTpblSectionActive ? "bg-transparent" : "bg-black"}`}
    >
      <div
        className={`pointer-events-none absolute inset-0 transition-transform duration-300 ease-out ${
          isTpblSectionActive ? "bg-transparent" : plgBackgroundClass
        }`}
        style={{ transform: `translateX(${(1 - backgroundReveal) * -100}%)` }}
      />
      <div
        className={`relative mx-auto min-h-[120vh] max-w-[92rem] gap-4 px-4 pt-16 pb-24 sm:min-h-[130vh] sm:px-6 sm:pt-20 lg:px-8 ${
          isTpblSectionActive ? "bg-transparent" : isPastAnimation ? "bg-transparent" : "bg-black"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
