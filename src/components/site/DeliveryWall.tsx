import Image from "next/image";
import type { Delivery } from "@/lib/types";

/**
 * Masonry wall of real delivery-day photos for /testimonials.
 * CSS columns handle the mixed portrait/landscape ratios without JS.
 */
export function DeliveryWall({ deliveries }: { deliveries: Delivery[] }) {
  if (!deliveries.length) return null;

  return (
    <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
      {deliveries.map((delivery) => (
        <figure
          key={delivery.id}
          className="group relative mb-4 break-inside-avoid overflow-hidden rounded-card bg-alt"
        >
          <Image
            src={delivery.image}
            alt={delivery.alt}
            width={delivery.width}
            height={delivery.height}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="h-auto w-full transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
          />
          <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-3 pb-2.5 pt-10 text-[12px] font-medium leading-snug text-white">
            Delivered — {delivery.unit}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
