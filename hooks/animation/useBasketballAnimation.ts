"use client";

import { useState } from "react";
import { ActiveNav } from "@/features/schedule/components/types/scheduleTypes";
import {
  BasketballAnimationRefs,
  useGsapScrollAnimation,
} from "./useGsapScrollAnimation";
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

  useGsapScrollAnimation({
    refs,
    drawFrame,
    onIntroReadyChange: setIsPastAnimation,
    onBackgroundRevealChange: setBackgroundReveal,
    onActiveNavChange: setActiveNav,
  });

  return {
    isReady,
    isPastAnimation,
    backgroundReveal,
    activeNav,
  };
}
