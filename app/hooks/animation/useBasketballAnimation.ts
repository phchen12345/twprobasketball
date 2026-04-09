"use client";

import { useState } from "react";
import { ActiveNav } from "../../components/schedule/scheduleTypes";
import { BasketballAnimationRefs, useGsapScrollAnimation } from "./useGsapScrollAnimation";
import { useCanvasFrames } from "./useCanvasFrames";

type Params = {
  refs: BasketballAnimationRefs;
};

export function useBasketballAnimation({ refs }: Params) {
  const { isReady, drawFrame } = useCanvasFrames({
    canvasRef: refs.canvasRef,
  });
  const [isPastAnimation, setIsPastAnimation] = useState(false);
  const [backgroundReveal, setBackgroundReveal] = useState(0);
  const [activeNav, setActiveNav] = useState<ActiveNav>(null);
  const [isTpblSectionActive, setIsTpblSectionActive] = useState(false);
  const [isBclSectionActive, setIsBclSectionActive] = useState(false);

  useGsapScrollAnimation({
    refs,
    drawFrame,
    onIntroReadyChange: setIsPastAnimation,
    onBackgroundRevealChange: setBackgroundReveal,
    onActiveNavChange: setActiveNav,
    onTpblSectionThemeChange: setIsTpblSectionActive,
    onBclSectionThemeChange: setIsBclSectionActive,
  });

  return {
    isReady,
    isPastAnimation,
    backgroundReveal,
    activeNav,
    isTpblSectionActive,
    isBclSectionActive,
  };
}
