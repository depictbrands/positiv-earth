"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { getDebugValues, subscribeDebug } from "@/lib/about/debugStore";

// Dev-only overlay (Golden rule #4): shows live global + per-scene progress and
// lets you scrub to any global scroll value. Never remove during development.
export default function AboutDebugOverlay() {
  const [open, setOpen] = useState(true);
  const [globalP, setGlobalP] = useState(0);

  // Re-render when any system publishes a new progress value.
  useSyncExternalStore(
    subscribeDebug,
    () => {
      let sum = 0;
      getDebugValues().forEach((v) => (sum += v));
      return sum; // cheap changing snapshot
    },
    () => 0,
  );

  // Track global page scroll progress on its own rAF loop.
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setGlobalP(max > 0 ? window.scrollY / max : 0);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (process.env.NODE_ENV === "production") return null;

  const scrub = (value: number) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: value * max });
  };

  const rows: [string, number][] = [
    ["global P", globalP],
    ...[...getDebugValues().entries()].sort(([a], [b]) => a.localeCompare(b)),
  ];

  return (
    <div className="fixed bottom-3 left-3 z-[999] select-none rounded-md bg-black/80 px-3 py-2 font-mono text-[11px] leading-tight text-white backdrop-blur">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mb-1 block w-full text-left font-bold tracking-wide text-white/70"
      >
        ⓘ motion debug {open ? "▾" : "▸"}
      </button>
      {open && (
        <div className="flex flex-col gap-1">
          {rows.map(([name, value]) => (
            <div key={name} className="flex justify-between gap-3">
              <span className="text-white/60">{name}</span>
              <span>{value.toFixed(3)}</span>
            </div>
          ))}
          <input
            aria-label="Scrub global progress"
            type="range"
            min={0}
            max={1}
            step={0.001}
            value={globalP}
            onChange={(e) => scrub(Number(e.target.value))}
            className="mt-1 w-44 accent-white"
          />
        </div>
      )}
    </div>
  );
}
