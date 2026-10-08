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

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(timer);
  }, [total]);

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
