"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const IMAGES = [
  "/images/hero-road.jpg",
  "/images/life-camp.jpg",
  "/images/life-lot.jpg",
  "/images/gallery-kitchen.jpg",
  "/images/gallery-lounge.jpg",
  "/images/gallery-bed.jpg",
];

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);
  const total = IMAGES.length;

  // Auto-advance every 5s; the interval restarts on manual navigation too.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearTimeout(timer);
  }, [index, total]);

  const go = (dir: 1 | -1) => setIndex((prev) => (prev + dir + total) % total);

  return (
    <div className="relative mx-auto aspect-[16/9] max-w-[1180px] overflow-hidden rounded-card bg-alt">
      {IMAGES.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt="Tony Used Campers - caravan lot and camping life slideshow"
          fill
          priority={i === 0}
          sizes="(max-width: 1180px) 100vw, 1180px"
          className={`object-cover transition-opacity duration-[1200ms] ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Prev / next arrows */}
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-[180ms] hover:bg-black/60 md:left-6"
      >
        <i className="fa-solid fa-chevron-left text-[15px]" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-all duration-[180ms] hover:bg-black/60 md:right-6"
      >
        <i className="fa-solid fa-chevron-right text-[15px]" aria-hidden="true" />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm">
        {IMAGES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}