"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const AUTOPLAY_MS = 4000;

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const shown = images.length ? images : ["https://res.cloudinary.com/hrnohv4p/image/upload/tuc/images/hero-road.jpg"];
  const total = shown.length;

  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const [prefersReduced, setPrefersReduced] = useState(false);

  // Respect the user's "reduce motion" OS setting.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const go = useCallback(
    (dir: 1 | -1) => setActive((prev) => (prev + dir + total) % total),
    [total],
  );

  // Autoplay — the timer restarts on every image change (manual or timed),
  // so clicking a thumbnail or arrow gives you a full 4s before it moves on.
  useEffect(() => {
    if (prefersReduced || total < 2) return;
    const timer = setTimeout(() => {
      setActive((prev) => (prev + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [active, total, prefersReduced, open]);

  // Full-screen keyboard nav + body scroll lock.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go]);

  const expandBtn =
    "grid h-11 w-11 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-black/60";

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-alt">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="View photos full screen"
          className="absolute inset-0 z-10 cursor-zoom-in"
        />
        <Image
          key={shown[active]}
          src={shown[active]}
          alt={`${title} — photo ${active + 1}`}
          fill
          priority={active === 0}
          sizes="(max-width: 1024px) 100vw, 640px"
          className="object-cover transition-opacity duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        />
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
              aria-label="Previous photo"
              className={`${expandBtn} absolute left-3 top-1/2 -translate-y-1/2`}
            >
              <i className="fa-solid fa-chevron-left text-[15px]" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
              aria-label="Next photo"
              className={`${expandBtn} absolute right-3 top-1/2 -translate-y-1/2`}
            >
              <i className="fa-solid fa-chevron-right text-[15px]" aria-hidden="true" />
            </button>
          </>
        )}
        {/* Full-screen affordance */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          aria-label="View photos full screen"
          className={`${expandBtn} absolute bottom-3 right-3 z-20`}
        >
          <i className="fa-solid fa-expand text-[14px]" aria-hidden="true" />
        </button>
      </div>

      {total > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {shown.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-pressed={i === active}
              className={`relative aspect-[4/3] overflow-hidden rounded-box bg-alt transition-all duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                i === active
                  ? "ring-2 ring-accent ring-offset-2"
                  : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="160px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Full-screen lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — photos`}
        >
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-[14px] font-medium tabular-nums text-white/80">
              {active + 1} / {total}
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close full screen"
              className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors duration-[160ms] hover:bg-white/25"
            >
              <i className="fa-solid fa-xmark text-[17px]" aria-hidden="true" />
            </button>
          </div>

          <div className="relative flex-1 min-h-0">
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                  className={`${expandBtn} absolute left-4 top-1/2 z-10 -translate-y-1/2`}
                >
                  <i
                    className="fa-solid fa-chevron-left text-[18px]"
                    aria-hidden="true"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next photo"
                  className={`${expandBtn} absolute right-4 top-1/2 z-10 -translate-y-1/2`}
                >
                  <i
                    className="fa-solid fa-chevron-right text-[18px]"
                    aria-hidden="true"
                  />
                </button>
              </>
            )}
            <Image
              key={`fs-${shown[active]}`}
              src={shown[active]}
              alt={`${title} — photo ${active + 1}`}
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {total > 1 && (
            <div className="flex justify-center gap-3 overflow-x-auto px-5 py-5">
              {shown.map((src, i) => (
                <button
                  key={src}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show photo ${i + 1}`}
                  className={`h-16 w-24 shrink-0 overflow-hidden rounded-box bg-white/10 transition-all duration-[160ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    i === active ? "ring-2 ring-white" : "opacity-50 hover:opacity-90"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    width={96}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}