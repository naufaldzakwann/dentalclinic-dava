// Fallback statis jika WebGL tidak tersedia / prefers-reduced-motion
export default function StaticTooth() {
  return (
    <div className="absolute inset-0 grid place-items-center" aria-hidden>
      <div className="relative">
        <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-brand-200/50 blur-3xl" />
        <svg width="180" height="180" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3.5c-2.6 0-3.4 1.2-5 1.2C4.6 4.7 3 6.2 3 8.6c0 3.4 1.6 5.1 2.2 8.2.3 1.6.7 3.2 1.8 3.2 1.6 0 1.3-2.3 1.9-4.3.4-1.5.9-2.4 3.1-2.4s2.7.9 3.1 2.4c.6 2 .3 4.3 1.9 4.3 1.1 0 1.5-1.6 1.8-3.2.6-3.1 2.2-5 2.2-8.4 0-2.4-1.6-3.9-4-3.9-1.6 0-2.4-1.2-5-1.2z"
            fill="url(#g)"
          />
          <defs>
            <linearGradient id="g" x1="3" y1="4" x2="21" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="1" stopColor="#d9efe9" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
