"use client";

import { useId } from "react";

const OUTLINE = "M75 187C52 169 44 130 53 101c5-21 19-38 38-44 14-5 28 0 43 9l21 12c17-9 35-25 55-21 29 5 50 26 58 54 10 32 0 60-22 79-9 17-9 33-5 59 5 31-6 61-25 82-11 13-26 21-34 16-5-3-2-8 5-17 13-18 18-39 14-58-4-26-17-50-32-58-6-4-14-4-21 2-16 13-27 34-30 57-4 21 5 45 19 65 4 7 0 11-8 8-23-11-42-33-49-58-9-29-4-56-1-75 3-12 1-19-4-26Z";

/** A scroll-friendly illustration while WebGL loads or is unavailable. */
export default function StaticTooth() {
  const id = useId().replace(/:/g, "");
  return <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
    <svg viewBox="0 0 320 400" className="h-[70%] max-h-[570px] w-[75%] max-w-[430px] overflow-visible drop-shadow-[0_24px_25px_rgba(90,58,139,0.17)]" fill="none">
      <defs>
        <path id={`${id}-outline`} d={OUTLINE} />
        <clipPath id={`${id}-clip`}><use href={`#${id}-outline`} /></clipPath>
        <linearGradient id={`${id}-enamel`} x1="80" y1="55" x2="247" y2="338" gradientUnits="userSpaceOnUse"><stop stopColor="#fffef5" /><stop offset=".42" stopColor="#f6f1e2" /><stop offset="1" stopColor="#dfd3b9" /></linearGradient>
        <linearGradient id={`${id}-side`} x1="184" y1="85" x2="244" y2="320" gradientUnits="userSpaceOnUse"><stop stopColor="#b4a58a" stopOpacity="0" /><stop offset="1" stopColor="#8e7e62" stopOpacity=".32" /></linearGradient>
        <linearGradient id={`${id}-root`} x1="156" y1="170" x2="156" y2="349" gradientUnits="userSpaceOnUse"><stop stopColor="#e5d8ba" stopOpacity=".03" /><stop offset="1" stopColor="#ccb997" stopOpacity=".3" /></linearGradient>
        <radialGradient id={`${id}-shadow`}><stop stopColor="#7851ac" stopOpacity=".2" /><stop offset="1" stopColor="#7851ac" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="160" cy="367" rx="95" ry="18" fill={`url(#${id}-shadow)`} />
      <use href={`#${id}-outline`} fill={`url(#${id}-enamel)`} stroke="#d5cebc" strokeWidth="1.5" strokeLinejoin="round" />
      <g clipPath={`url(#${id}-clip)`}>
        <path d="M184 60c43 11 72 55 61 95-9 32-20 46-17 73 5 37-4 69-28 96l-27 30h91V63Z" fill={`url(#${id}-side)`} />
        <path d="M50 180h220v180H50Z" fill={`url(#${id}-root)`} />
      </g>
      <path d="M153 83c-7 12-8 27-5 40m-49-4c14-11 27-12 39-6m31 0c16-7 30-4 45 9" stroke="#cfc5ad" strokeWidth="3" strokeLinecap="round" opacity=".45" />
      <path d="M83 185c46 12 102 14 153-1" stroke="#c9bda1" strokeWidth="2" strokeLinecap="round" opacity=".4" />
      <path d="M79 95c-10 15-13 32-8 47" stroke="white" strokeWidth="7" strokeLinecap="round" opacity=".65" />
    </svg>
  </div>;
}
