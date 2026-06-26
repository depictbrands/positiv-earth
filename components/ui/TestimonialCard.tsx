"use client";

import { useEffect, useRef, useState } from "react";

type TestimonialCardProps = {
  alt: string;
  className?: string;
  posterUrl?: string;
  videoUrl: string;
};

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function MutedIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-1/2 w-1/2"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function SoundIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-1/2 w-1/2"
      aria-hidden="true"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

export default function TestimonialCard({
  alt,
  className,
  posterUrl,
  videoUrl,
}: TestimonialCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  // React doesn't reliably reflect `muted` to the element, so sync via ref.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  function handleEnter() {
    void videoRef.current?.play().catch(() => {});
  }

  function handleLeave() {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  }

  function toggleSound() {
    setMuted((value) => !value);
  }

  return (
    <article
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn(
        "group relative overflow-hidden rounded-card-corner bg-base-black",
        className,
      )}
      style={{
        width: "var(--size-testimonial-card-width)",
        height: "var(--size-testimonial-card-height)",
      }}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <button
        type="button"
        onClick={toggleSound}
        aria-pressed={!muted}
        aria-label={muted ? "Turn sound on" : "Turn sound off"}
        className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full text-base-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-base-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        style={{
          backgroundColor: "var(--color-header-glass-surface)",
          backdropFilter: "blur(var(--blur-header-glass))",
          WebkitBackdropFilter: "blur(var(--blur-header-glass))",
        }}
      >
        {muted ? <MutedIcon /> : <SoundIcon />}
      </button>
    </article>
  );
}
