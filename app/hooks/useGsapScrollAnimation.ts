"use client";

import { RefObject, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ActiveNav } from "../components/scheduleTypes";
import { BASKETBALL_ANIMATION_CONFIG } from "./basketballAnimation.constants";

gsap.registerPlugin(ScrollTrigger);

export type BasketballAnimationRefs = {
  sectionRef: RefObject<HTMLDivElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  contentSectionRef: RefObject<HTMLDivElement | null>;
  thirdSectionRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

type Params = {
  refs: BasketballAnimationRefs;
  drawFrame: (frameIndex: number) => void;
  onIntroReadyChange: (isPastAnimation: boolean) => void;
  onBackgroundRevealChange: (progress: number) => void;
  onActiveNavChange: (activeNav: ActiveNav) => void;
  onThirdSectionThemeChange: (isActive: boolean) => void;
};

export function useGsapScrollAnimation({
  refs,
  drawFrame,
  onIntroReadyChange,
  onBackgroundRevealChange,
  onActiveNavChange,
  onThirdSectionThemeChange,
}: Params) {
  const { canvasRef, sectionRef, stageRef, contentSectionRef, thirdSectionRef } = refs;
  const frameState = useRef({ frame: 0 });
  const lastPastAnimation = useRef(false);
  const lastActiveNav = useRef<ActiveNav>(null);
  const lastThemeState = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const contentSection = contentSectionRef.current;
    const thirdSection = thirdSectionRef.current;

    if (!canvas || !section || !stage || !contentSection || !thirdSection) {
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

    const setThemeState = (value: boolean) => {
      if (lastThemeState.current !== value) {
        lastThemeState.current = value;
        onThirdSectionThemeChange(value);
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
      trigger: contentSection,
      start: BASKETBALL_ANIMATION_CONFIG.backgroundRevealStart,
      end: BASKETBALL_ANIMATION_CONFIG.backgroundRevealEnd,
      scrub: true,
      onEnter: () => onBackgroundRevealChange(1),
      onUpdate: (self) => onBackgroundRevealChange(self.progress),
      onEnterBack: () => onBackgroundRevealChange(1),
      onLeaveBack: () => onBackgroundRevealChange(0),
    });

    const plgNavTrigger = ScrollTrigger.create({
      trigger: contentSection,
      start: BASKETBALL_ANIMATION_CONFIG.plgNavStart,
      end: BASKETBALL_ANIMATION_CONFIG.plgNavEnd,
      onEnter: () => setActiveNav("plg"),
      onEnterBack: () => setActiveNav("plg"),
      onLeave: () => setActiveNav(null),
      onLeaveBack: () => setActiveNav(null),
    });

    const thirdSectionThemeTrigger = ScrollTrigger.create({
      trigger: thirdSection,
      start: BASKETBALL_ANIMATION_CONFIG.tpblThemeStart,
      end: BASKETBALL_ANIMATION_CONFIG.tpblThemeEnd,
      onEnter: () => setThemeState(true),
      onEnterBack: () => setThemeState(true),
      onLeave: () => setThemeState(true),
      onLeaveBack: () => setThemeState(false),
    });

    const tpblNavTrigger = ScrollTrigger.create({
      trigger: thirdSection,
      start: BASKETBALL_ANIMATION_CONFIG.tpblNavStart,
      end: BASKETBALL_ANIMATION_CONFIG.tpblNavEnd,
      onEnter: () => setActiveNav("tpbl"),
      onEnterBack: () => setActiveNav("tpbl"),
      onLeave: () => setActiveNav(null),
      onLeaveBack: () => setActiveNav("plg"),
    });

    const resizeHandler = () => drawFrame(frameState.current.frame);
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      plgNavTrigger.kill();
      tpblNavTrigger.kill();
      thirdSectionThemeTrigger.kill();
      backgroundTrigger.kill();
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [
    drawFrame,
    onActiveNavChange,
    onBackgroundRevealChange,
    onIntroReadyChange,
    onThirdSectionThemeChange,
    canvasRef,
    sectionRef,
    stageRef,
    contentSectionRef,
    thirdSectionRef,
  ]);
}
