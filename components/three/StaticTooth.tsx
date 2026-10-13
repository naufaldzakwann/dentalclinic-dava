"use client";

import { useRef, useState } from "react";

type PointerPosition = { x: number; y: number; button: number; pointerType: string };

export default function StaticTooth() {
  const activePointers = useRef(new Map<number, PointerPosition>());
  const [rotation, setRotation] = useState({ x: -5, y: -12 });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    activePointers.current.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
      button: event.button,
      pointerType: event.pointerType,
    });
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const previous = activePointers.current.get(event.pointerId);
    if (!previous) return;

    const dx = event.clientX - previous.x;
    const dy = event.clientY - previous.y;
    if (activePointers.current.size > 1 || (previous.pointerType === "mouse" && previous.button === 2)) {
      setPosition((current) => ({ x: current.x + dx, y: current.y + dy }));
    } else {
      setRotation((current) => ({
        x: Math.max(-32, Math.min(32, current.x - dy * 0.35)),
        y: current.y + dx * 0.45,
      }));
    }
    activePointers.current.set(event.pointerId, { ...previous, x: event.clientX, y: event.clientY });
  };

  const endPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    activePointers.current.delete(event.pointerId);
  };

  return (
    <div
      className="absolute inset-0 grid -translate-y-12 touch-none place-items-center [perspective:1000px] sm:translate-y-0"
      aria-hidden="true"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div
        className="relative w-[min(52%,10.75rem)] select-none [transform-style:preserve-3d] sm:w-[min(65%,19rem)]"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        <div className="absolute inset-x-[9%] bottom-[8%] h-[18%] rounded-full bg-brand-700/15 blur-2xl [transform:rotateX(72deg)]" />
        <svg viewBox="0 0 400 440" className="relative w-full overflow-visible drop-shadow-[0_28px_32px_rgba(71,42,119,0.24)]">
          <defs>
            <linearGradient id="molar-enamel" x1="67" y1="62" x2="300" y2="357" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset=".38" stopColor="#fffdf8" />
              <stop offset=".72" stopColor="#f1eafa" />
              <stop offset="1" stopColor="#c9b9e1" />
            </linearGradient>
            <linearGradient id="molar-side" x1="235" y1="142" x2="330" y2="317" gradientUnits="userSpaceOnUse">
              <stop stopColor="#bba7d8" stopOpacity=".08" />
              <stop offset=".48" stopColor="#aa94cb" stopOpacity=".34" />
              <stop offset="1" stopColor="#8069a8" stopOpacity=".66" />
            </linearGradient>
            <linearGradient id="molar-highlight" x1="90" y1="76" x2="151" y2="245" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" stopOpacity=".98" />
              <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="root-shade" x1="166" y1="237" x2="179" y2="357" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c4b1dd" stopOpacity=".16" />
              <stop offset="1" stopColor="#937bb6" stopOpacity=".62" />
            </linearGradient>
            <filter id="molar-shadow" x="16" y="24" width="368" height="404" colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse">
              <feGaussianBlur stdDeviation="9" />
            </filter>
          </defs>

          <ellipse cx="206" cy="397" rx="108" ry="18" fill="#7956ad" fillOpacity=".13" filter="url(#molar-shadow)" />
          <path
            d="M77 181C54 161 47 132 57 105 69 73 102 57 134 65c23 6 36 22 59 22 22 0 38-16 61-22 32-8 66 8 78 40 11 28 2 59-20 80-18 17-29 31-34 55l-17 93c-5 25-27 31-39 9l-31-61c-8-16-20-16-28 0l-31 62c-11 22-34 16-39-8l-19-95c-5-25-13-43-27-59Z"
            fill="url(#molar-enamel)"
            stroke="#d5c6eb"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M224 92c19-3 32-18 52-22 25-5 50 7 61 29 12 24 5 49-11 68-14 17-31 30-38 53-7 22-13 70-20 105-4 19-18 26-30 11 4-23 9-55 2-75-7-21-22-29-42-31 24-15 36-37 39-60 3-28-5-54-13-78Z" fill="url(#molar-side)" />
          <path d="M89 91c18-17 42-21 62-10 14 7 22 20 37 23-18 5-28 20-48 20-17 0-37-8-54 1-12 6-18 16-24 29-7-25 5-49 27-63Z" fill="url(#molar-highlight)" />
          <path d="M104 153c12-18 27-27 45-29 12-1 20 3 30 9m34-1c12-7 23-10 37-7 18 4 31 14 42 32" stroke="#d3c4e8" strokeWidth="6" strokeLinecap="round" opacity=".78" />
          <path d="M180 132c-4 17-3 33 2 46m28-45c5 17 4 32-1 45" stroke="#d4c5e8" strokeWidth="5" strokeLinecap="round" opacity=".72" />
          <path d="M124 232c10 31 11 73 17 111 2 12 9 17 17 9l29-58c7-14 16-20 27-21-17-10-28-26-34-47-15 20-33 27-56 6Z" fill="url(#root-shade)" opacity=".72" />
          <path d="M91 112c-9 15-11 32-5 48" stroke="white" strokeWidth="9" strokeLinecap="round" opacity=".78" />
          <ellipse cx="113" cy="85" rx="8" ry="12" transform="rotate(-30 113 85)" fill="white" fillOpacity=".86" />
        </svg>
      </div>
    </div>
  );
}
