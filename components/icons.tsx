import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const ToothIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 4.2c-2.2 0-3 1-4.4 1C5.6 5.2 4.2 6.5 4.2 8.7c0 3 1.4 4.5 1.9 7.2.3 1.4.6 2.7 1.5 2.7 1.4 0 1.1-2 1.6-3.7.4-1.3.8-2 2.8-2s2.4.7 2.8 2c.5 1.7.2 3.7 1.6 3.7.9 0 1.2-1.3 1.5-2.7.5-2.7 1.9-4.2 1.9-7.2 0-2.2-1.4-3.5-3.4-3.5-1.4 0-2.2-1-4.4-1z" />
  </svg>
);

export const SparkleIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
  </svg>
);

export const ShieldPlusIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 3l7 3v5c0 5-3.4 8.4-7 10-3.6-1.6-7-5-7-10V6l7-3z" />
    <path d="M12 9v6M9 12h6" />
  </svg>
);

export const ChatIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M21 12a8 8 0 0 1-8 8H4l1.5-3A8 8 0 1 1 21 12z" />
    <path d="M9 11h6M9 14h3" />
  </svg>
);

export const WalletIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="6" width="18" height="13" rx="3" />
    <path d="M3 10h18M16 14h2" />
  </svg>
);

export const HeartIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 20s-7.5-4.6-7.5-10A4.4 4.4 0 0 1 12 6.5 4.4 4.4 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />
  </svg>
);

export const SmileIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M8.5 13.5a4.5 4.5 0 0 0 7 0" />
    <path d="M9 9.5h.01M15 9.5h.01" strokeWidth="2.4" />
  </svg>
);

export const WrenchIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M14.5 6.5a4 4 0 0 0-5.4 4.9L4 16.5V20h3.5l5.1-5.1a4 4 0 0 0 4.9-5.4L15 12l-3-3 2-2.5z" />
  </svg>
);

export const SunIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6L17 7M7 17l-1.4 1.4" />
  </svg>
);

export const MoonIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M20.1 15.2A8.5 8.5 0 0 1 8.8 3.9 8.6 8.6 0 1 0 20.1 15.2z" />
  </svg>
);

export const ClockIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const MapPinIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 21s-6.5-5.3-6.5-10a6.5 6.5 0 1 1 13 0c0 4.7-6.5 10-6.5 10z" />
    <circle cx="12" cy="10.5" r="2.2" />
  </svg>
);

export const PhoneIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 4h4l1.5 4L8 10a12 12 0 0 0 6 6l2-2.5L18 15v4a1.5 1.5 0 0 1-1.6 1.5C9.4 20 4 14.6 4 7.6A1.6 1.6 0 0 1 5 4z" />
  </svg>
);

export const ArrowRightIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const StarIcon = (p: P) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3 1.1-6.5-4.7-4.6 6.5-.9L12 2.6z" />
  </svg>
);

export const MenuIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
