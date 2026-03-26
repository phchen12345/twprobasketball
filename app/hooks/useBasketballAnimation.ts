"use client";

import { RefObject, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ActiveNav } from "../components/scheduleTypes";

const frameCount = 80;

function buildFrameSrc(index: number) {
  return `/basketball-animation/ezgif-frame-${String(index).padStart(3, "0")}.png`;
}

gsap.registerPlugin(ScrollTrigger);

type Params = {
  sectionRef: RefObject<HTMLDivElement | null>;
  stageRef: RefObject<HTMLDivElement | null>;
  contentSectionRef: RefObject<HTMLDivElement | null>;
  thirdSectionRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

export function useBasketballAnimation({
  sectionRef,
  stageRef,
  contentSectionRef,
  thirdSectionRef,
  canvasRef,
}: Params) {
  const frameState = useRef({ frame: 0 });
  const loadedImages = useRef<HTMLImageElement[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isPastAnimation, setIsPastAnimation] = useState(false);
  const [backgroundReveal, setBackgroundReveal] = useState(0);
  const [activeNav, setActiveNav] = useState<ActiveNav>(null);
  const [isThirdSectionActive, setIsThirdSectionActive] = useState(false);

  const frameSources = useMemo(
    () => Array.from({ length: frameCount }, (_, index) => buildFrameSrc(index + 1)),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const contentSection = contentSectionRef.current;
    const thirdSection = thirdSectionRef.current;

    if (!canvas || !section || !stage || !contentSection || !thirdSection) {
      return;
    }

    let destroyed = false;

    function drawFrame(frameIndex: number) {
      const activeCanvas = canvasRef.current;
      const activeContext = activeCanvas?.getContext("2d");
      const image = loadedImages.current[frameIndex];
      if (!activeCanvas || !activeContext || !image || !image.complete) {
        return;
      }

      const parentWidth = activeCanvas.parentElement?.clientWidth ?? window.innerWidth;
      const maxWidth = Math.min(parentWidth, 1280);
      const aspectRatio = image.width / image.height || 1;
      const canvasWidth = Math.round(maxWidth);
      const canvasHeight = Math.round(canvasWidth / aspectRatio);

      if (activeCanvas.width !== canvasWidth || activeCanvas.height !== canvasHeight) {
        activeCanvas.width = canvasWidth;
        activeCanvas.height = canvasHeight;
      }

      activeContext.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
      activeContext.drawImage(image, 0, 0, activeCanvas.width, activeCanvas.height);
    }

    const images = frameSources.map((src, index) => {
      const image = new Image();
      image.src = src;
      image.decoding = "async";
      image.onload = () => {
        if (destroyed) {
          return;
        }
        if (index === 0) {
          drawFrame(0);
          setIsReady(true);
        }
      };
      return image;
    });

    loadedImages.current = images;

    const tween = gsap.to(frameState.current, {
      frame: frameCount - 1,
      ease: "none",
      snap: "frame",
      onUpdate: () => drawFrame(frameState.current.frame),
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=1176",
        scrub: 0.6,
        pin: stage,
        anticipatePin: 1,
        onUpdate: (self) => setIsPastAnimation(self.progress >= 1),
      },
    });

    const backgroundTrigger = ScrollTrigger.create({
      trigger: contentSection,
      start: "top bottom",
      end: "top 50%",
      scrub: true,
      onEnter: () => setBackgroundReveal(1),
      onUpdate: (self) => setBackgroundReveal(self.progress),
      onEnterBack: () => setBackgroundReveal(1),
      onLeaveBack: () => setBackgroundReveal(0),
    });

    const plgNavTrigger = ScrollTrigger.create({
      trigger: contentSection,
      start: "top 45%",
      end: "bottom 45%",
      onEnter: () => setActiveNav("plg"),
      onEnterBack: () => setActiveNav("plg"),
      onLeave: () => setActiveNav(null),
      onLeaveBack: () => setActiveNav(null),
    });

    const thirdSectionTrigger = ScrollTrigger.create({
      trigger: thirdSection,
      start: "top 30%",
      end: "bottom 30%",
      onEnter: () => {
        setIsThirdSectionActive(true);
        setActiveNav("tpbl");
      },
      onEnterBack: () => {
        setIsThirdSectionActive(true);
        setActiveNav("tpbl");
      },
      onLeave: () => {
        setIsThirdSectionActive(false);
        setActiveNav(null);
      },
      onLeaveBack: () => {
        setIsThirdSectionActive(false);
        setActiveNav("plg");
      },
    });

    const resizeHandler = () => drawFrame(frameState.current.frame);
    window.addEventListener("resize", resizeHandler);

    return () => {
      destroyed = true;
      window.removeEventListener("resize", resizeHandler);
      plgNavTrigger.kill();
      thirdSectionTrigger.kill();
      backgroundTrigger.kill();
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [canvasRef, contentSectionRef, frameSources, sectionRef, stageRef, thirdSectionRef]);

  return {
    isReady,
    isPastAnimation,
    backgroundReveal,
    activeNav,
    isThirdSectionActive,
  };
}
