"use client";

import { PointerEvent, useRef, useState } from "react";

const START_ROTATION = { x: -18, y: 24 };

export default function RotatingBasketball() {
  const [rotation, setRotation] = useState(START_ROTATION);
  const dragState = useRef({
    active: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    baseX: START_ROTATION.x,
    baseY: START_ROTATION.y,
  });

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    dragState.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      baseX: rotation.x,
      baseY: rotation.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragState.current.active || dragState.current.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.current.startX;
    const deltaY = event.clientY - dragState.current.startY;

    setRotation({
      x: Math.max(-50, Math.min(50, dragState.current.baseX - deltaY * 0.2)),
      y: dragState.current.baseY + deltaX * 0.32,
    });
  }

  function finishDrag(event: PointerEvent<HTMLDivElement>) {
    if (dragState.current.pointerId !== event.pointerId) {
      return;
    }

    dragState.current.active = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <div className="ballStage">
      <div
        className="ballDragArea"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={finishDrag}
        onPointerCancel={finishDrag}
        role="img"
        aria-label="360 degree basketball viewer"
      >
        <div
          className="ball3d"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          <div className="ballCore">
            <span className="ballLine ballLineVertical" />
            <span className="ballLine ballLineHorizontal" />
            <span className="ballArc ballArcLeft" />
            <span className="ballArc ballArcRight" />
            <span className="ballArc ballArcTop" />
            <span className="ballArc ballArcBottom" />
            <span className="ballHighlight" />
          </div>
        </div>
      </div>
      <p className="dragHint">Drag to rotate 360 deg</p>
    </div>
  );
}
