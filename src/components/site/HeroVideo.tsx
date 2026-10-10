"use client";

import { useEffect, useRef } from "react";

/**
 * Looping background video for the home hero.
 *
 * Mobile browsers are aggressive about blocking autoplay (Low Data Mode,
 * battery saver, reduced-motion). The video is muted + playsInline and we
 * retry play() on mount and again on the first user gesture; if playback is
 * never allowed, the poster image simply stays visible.
 */
export function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const tryPlay = () => {
      void video.play().catch(() => {
        /* blocked — poster stays; a later gesture may unlock it */
      });
    };
    tryPlay();

    const unlock = () => {
      tryPlay();
      if (video.paused) {
        window.addEventListener("pointerdown", unlock, { passive: true });
        window.addEventListener("touchstart", unlock, { passive: true });
        window.addEventListener("scroll", unlock, { passive: true });
      } else {
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("touchstart", unlock);
        window.removeEventListener("scroll", unlock);
      }
    };
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("touchstart", unlock, { passive: true });
    window.addEventListener("scroll", unlock, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("scroll", unlock);
    };
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
