"use client";

import Image from "next/image";
import { useState } from "react";

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const shown = images.length ? images : ["/images/hero-road.jpg"];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-alt">
        <Image
          key={shown[active]}
          src={shown[active]}
          alt={`${title} — photo ${active + 1}`}
          fill
          priority={active === 0}
          sizes="(max-width: 1024px) 100vw, 640px"
          className="object-cover transition-opacity duration-[300ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        />
      </div>

      {shown.length > 1 && (
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
    </div>
  );
}
