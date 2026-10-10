/**
 * Injects a JSON-LD graph into the page head-safe body. Kept as a server
 * component so the payload never ships to the client bundle.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
