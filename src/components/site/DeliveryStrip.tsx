import Image from "next/image";
import type { Delivery } from "@/lib/types";

/**
 * Auto-scrolling "Fresh off the lot" marquee of recent delivery photos.
 * Pure CSS animation — pauses on hover, stops entirely for reduced motion.
 */
export function DeliveryStrip({ deliveries }: { deliveries: Delivery[] }) {
  if (!deliveries.length) return null;
  // Duplicate the list so the -50% translate loops seamlessly.
  const loop = [...deliveries, ...deliveries];

  return (
    <div className="group relative -mx-4 overflow-hidden px-4 md:-mx-6 md:px-6">
      <div className="flex w-max animate-[marquee_70s_linear_infinite] gap-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none md:gap-5">
        {loop.map((delivery, i) => (
          <figure
            key={`${delivery.id}-${i}`}
            aria-hidden={i >= deliveries.length}
            className="relative h-56 w-40 shrink-0 overflow-hidden rounded-card bg-alt sm:h-64 sm:w-48 md:h-72 md:w-56"
          >
            <Image
              src={delivery.image}
              alt={i < deliveries.length ? delivery.alt : ""}
              fill
              sizes="224px"
              className="object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-3 pb-2.5 pt-10 text-[12px] font-medium leading-snug text-white">
              {delivery.unit}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Edge fades into the section background */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent md:w-20"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent md:w-20"
        aria-hidden="true"
      />
    </div>
  );
}
