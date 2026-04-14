"use client";

import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BASKETBALL_ANIMATION_CONFIG,
  buildBasketballFrameSrc,
} from "./basketballAnimation.constants";

type Params = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
};

export function useCanvasFrames({ canvasRef }: Params) {
  const loadedImages = useRef<HTMLImageElement[]>([]);
  const [isReady, setIsReady] = useState(false);

  const frameSources = useMemo(
    () =>
      Array.from({ length: BASKETBALL_ANIMATION_CONFIG.frameCount }, (_, index) =>
        buildBasketballFrameSrc(index + 1),
      ),
    [],
  );

  const drawFrame = useCallback(
    (frameIndex: number) => {
      const activeCanvas = canvasRef.current;
      const activeContext = activeCanvas?.getContext("2d");
      const image = loadedImages.current[frameIndex];

      if (!activeCanvas || !activeContext || !image || !image.complete) {
        return;
      }

      const parentWidth = activeCanvas.parentElement?.clientWidth ?? window.innerWidth;
      const maxWidth = Math.min(parentWidth, BASKETBALL_ANIMATION_CONFIG.maxCanvasWidth);
      const aspectRatio = image.width / image.height || 1;
      const canvasWidth = Math.round(maxWidth);
      const canvasHeight = Math.round(canvasWidth / aspectRatio);

      if (activeCanvas.width !== canvasWidth || activeCanvas.height !== canvasHeight) {
        activeCanvas.width = canvasWidth;
        activeCanvas.height = canvasHeight;
      }

      activeContext.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
      activeContext.drawImage(image, 0, 0, activeCanvas.width, activeCanvas.height);
    },
    [canvasRef],
  );

  useEffect(() => {
    let destroyed = false;

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

    return () => {
      destroyed = true;
      loadedImages.current = [];
    };
  }, [drawFrame, frameSources]);

  return {
    isReady,
    drawFrame,
  };
}
