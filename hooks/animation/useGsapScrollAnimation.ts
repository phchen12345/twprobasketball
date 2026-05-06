"use client";

import { RefObject, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ActiveNav } from "@/features/schedule/components/types/scheduleTypes";
import { BASKETBALL_ANIMATION_CONFIG } from "./basketballAnimation.constants";

gsap.registerPlugin(ScrollTrigger);

export type BasketballAnimationRefs = {
  sectionRef: RefObject<HTMLDivElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  plgSectionRef: RefObject<HTMLDivElement | null>;
  tpblSectionRef: RefObject<HTMLElement | null>;
  bclSectionRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

type Params = {
  refs: BasketballAnimationRefs;
  drawFrame: (frameIndex: number) => void;
  onIntroReadyChange: (isPastAnimation: boolean) => void;
  onBackgroundRevealChange: (progress: number) => void;
  onActiveNavChange: (activeNav: ActiveNav) => void;
};

export function useGsapScrollAnimation({
  refs,
  drawFrame,
  onIntroReadyChange,
  onBackgroundRevealChange,
  onActiveNavChange,
}: Params) {
  const {
    canvasRef,
    sectionRef,
    stageRef,
    plgSectionRef,
    tpblSectionRef,
    bclSectionRef,
  } = refs;
  const frameState = useRef({ frame: 0 });
  const lastPastAnimation = useRef(false);
  const lastActiveNav = useRef<ActiveNav>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const plgSection = plgSectionRef.current;
    const tpblSection = tpblSectionRef.current;
    const bclSection = bclSectionRef.current;

    if (
      !canvas ||
      !section ||
      !stage ||
      !plgSection ||
      !tpblSection ||
      !bclSection
    ) {
      return;
    }

    const setPastAnimation = (value: boolean) => {
      if (lastPastAnimation.current !== value) {
        lastPastAnimation.current = value;
        onIntroReadyChange(value);
      }
    };

    const setActiveNav = (value: ActiveNav) => {
      if (lastActiveNav.current !== value) {
        lastActiveNav.current = value;
        onActiveNavChange(value);
      }
    };

    const tween = gsap.to(frameState.current, {
      frame: BASKETBALL_ANIMATION_CONFIG.frameCount - 1,
      ease: "none",
      snap: "frame",
      onUpdate: () => drawFrame(frameState.current.frame),
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${BASKETBALL_ANIMATION_CONFIG.introScrollDistance}`,
        scrub: BASKETBALL_ANIMATION_CONFIG.introScrub,
        pin: stage,
        anticipatePin: 1,
        onUpdate: (self) => setPastAnimation(self.progress >= 1),
      },
    });

    const backgroundTrigger = ScrollTrigger.create({
      trigger: plgSection,
      start: BASKETBALL_ANIMATION_CONFIG.backgroundRevealStart,
      end: BASKETBALL_ANIMATION_CONFIG.backgroundRevealEnd,
      scrub: true,
      onEnter: () => onBackgroundRevealChange(1),
      onUpdate: (self) => onBackgroundRevealChange(self.progress),
      onEnterBack: () => onBackgroundRevealChange(1),
      onLeaveBack: () => onBackgroundRevealChange(0),
    });

    const plgNavTrigger = ScrollTrigger.create({
      trigger: plgSection,
      start: BASKETBALL_ANIMATION_CONFIG.plgNavStart,
      end: BASKETBALL_ANIMATION_CONFIG.plgNavEnd,
      onEnter: () => setActiveNav("plg"),
      onEnterBack: () => setActiveNav("plg"),
      onLeave: () => setActiveNav(null),
      onLeaveBack: () => setActiveNav(null),
    });

    const tpblNavTrigger = ScrollTrigger.create({
      trigger: tpblSection,
      start: BASKETBALL_ANIMATION_CONFIG.tpblNavStart,
      end: BASKETBALL_ANIMATION_CONFIG.tpblNavEnd,
      onEnter: () => setActiveNav("tpbl"),
      onEnterBack: () => setActiveNav("tpbl"),
      onLeave: () => setActiveNav("bcl"),
      onLeaveBack: () => setActiveNav("plg"),
    });

    const bclNavTrigger = ScrollTrigger.create({
      trigger: bclSection,
      start: BASKETBALL_ANIMATION_CONFIG.bclNavStart,
      end: BASKETBALL_ANIMATION_CONFIG.bclNavEnd,
      onEnter: () => setActiveNav("bcl"),
      onEnterBack: () => setActiveNav("bcl"),
      onLeave: () => setActiveNav(null),
      onLeaveBack: () => setActiveNav("tpbl"),
    });

    let refreshFrameId: number | null = null;
    const scheduleScrollRefresh = () => {
      if (refreshFrameId !== null) {
        return;
      }

      refreshFrameId = window.requestAnimationFrame(() => {
        refreshFrameId = null;
        drawFrame(frameState.current.frame);
        ScrollTrigger.refresh();
      });
    };

    const resizeHandler = scheduleScrollRefresh;
    window.addEventListener("resize", resizeHandler);

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(scheduleScrollRefresh);

    resizeObserver?.observe(plgSection);
    resizeObserver?.observe(tpblSection);
    resizeObserver?.observe(bclSection);

    return () => {
      if (refreshFrameId !== null) {
        window.cancelAnimationFrame(refreshFrameId);
      }

      window.removeEventListener("resize", resizeHandler);
      resizeObserver?.disconnect();
      plgNavTrigger.kill();
      tpblNavTrigger.kill();
      bclNavTrigger.kill();
      backgroundTrigger.kill();
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [
    drawFrame,
    onActiveNavChange,
    onBackgroundRevealChange,
    onIntroReadyChange,
    canvasRef,
    sectionRef,
    stageRef,
    plgSectionRef,
    tpblSectionRef,
    bclSectionRef,
  ]);
}
