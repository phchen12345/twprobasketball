"use client";

import { useMemo, useState } from "react";
import { ActiveNav } from "../components/scheduleTypes";
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
  const [isThirdSectionActive, setIsThirdSectionActive] = useState(false);
  const [isBclSectionActive, setIsBclSectionActive] = useState(false);

  useGsapScrollAnimation({
    refs,
    drawFrame,
    onIntroReadyChange: setIsPastAnimation,
    onBackgroundRevealChange: setBackgroundReveal,
    onActiveNavChange: setActiveNav,
    onThirdSectionThemeChange: setIsThirdSectionActive,
    onBclSectionThemeChange: setIsBclSectionActive,
  });

  return useMemo(
    () => ({
      isReady,
      isPastAnimation,
      backgroundReveal,
      activeNav,
      isThirdSectionActive,
      isBclSectionActive,
    }),
    [activeNav, backgroundReveal, isBclSectionActive, isPastAnimation, isReady, isThirdSectionActive],
  );
}
