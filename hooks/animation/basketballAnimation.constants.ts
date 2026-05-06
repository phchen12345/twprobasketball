"use client";

export const BASKETBALL_ANIMATION_CONFIG = {
  frameCount: 80,
  maxCanvasWidth: 1280,
  introScrollDistance: 1176,
  introScrub: 0.6,
  backgroundRevealStart: "top bottom",
  backgroundRevealEnd: "top 50%",
  plgNavStart: "top 45%",
  plgNavEnd: "bottom 45%",
  tpblNavStart: "top 45%",
  tpblNavEnd: "bottom 45%",
  bclNavStart: "top 45%",
  bclNavEnd: "bottom top",
} as const;

export function buildBasketballFrameSrc(index: number) {
  return `/basketball-animation/ezgif-frame-${String(index).padStart(3, "0")}.webp`;
}
