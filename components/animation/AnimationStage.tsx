"use client";

import NextImage from "next/image";
import { RefObject } from "react";

type Props = {
  stageRef: RefObject<HTMLDivElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  isReady: boolean;
};

export default function AnimationStage({ stageRef, canvasRef, isReady }: Props) {
  return (
    <div
      ref={stageRef}
      className="scroll-stage flex min-h-screen items-center justify-center overflow-hidden bg-[#09090b]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.16),transparent_26%),linear-gradient(180deg,#111112_0%,#09090b_100%)]" />
      <div className="absolute inset-0">
        {!isReady ? (
          <div className="absolute inset-0 z-10 grid place-items-center text-sm text-zinc-500">
            Loading sequence...
          </div>
        ) : null}
        <canvas ref={canvasRef} className="h-full w-full" />
        <div className="absolute right-0 bottom-0 z-20 w-[98px] sm:w-[126px] lg:w-[154px]">
          <NextImage
            src="/logo.webp"
            alt="JASPER logo"
            className="h-auto w-full object-contain opacity-50 transition-opacity duration-300 hover:opacity-90 drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
            width={783}
            height={328}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
      </div>

      <div className="relative z-20 mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pt-24 pb-8 sm:px-6 sm:pt-32 lg:px-8">
        <div className="max-w-xl rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-md sm:max-w-2xl sm:p-8">
          {/* <p className="text-sm font-medium uppercase tracking-[0.24em] text-orange-300">
            PLG x TPBL x BCL
          </p> */}
          <h1 className="mt-4 font-serif text-3xl leading-none tracking-tight text-white sm:mt-5 sm:text-6xl lg:text-8xl">
            Track Taiwan&apos;s pro basketball schedules in one place
          </h1>
        </div>
      </div>
    </div>
  );
}
