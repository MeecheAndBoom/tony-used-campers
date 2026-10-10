import Link from "next/link";

/**
 * Renders the blog's lightweight Markdown: paragraphs split on blank lines,
 * `## ` / `### ` headings, `- ` bullets, `1. ` numbered lists, `> ` quotes,
 * `**bold**` inline emphasis and `[text](/path)` links. Server component — the
 * body never reaches the client as a parser.
 */

function renderInline(text: string): React.ReactNode[] {
  // Split on links first, then bold inside the plain segments.
  const nodes: React.ReactNode[] = [];
  const linkPattern = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > last) {
      nodes.push(renderBold(text.slice(last, match.index), key++));
    }
    const [full, label, href] = match;
    const content = renderBold(label, key++);
    nodes.push(
      href.startsWith("/") ? (
        <Link key={key++} href={href} className="text-accent hover:underline">
          {content}
        </Link>
      ) : (
        <a
          key={key++}
          href={href}
          className="text-accent hover:underline"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      ),
    );
    last = match.index + full.length;
  }
  if (last < text.length) nodes.push(renderBold(text.slice(last), key++));
  return nodes;
}

function renderBold(text: string, startKey: number): React.ReactNode {
  if (!text.includes("**")) return text;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") && part.length > 4 ? (
          <strong key={`${startKey}-${i}`} className="font-semibold text-ink">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function PostBody({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/);

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        const text = block.trim();
        if (!text) return null;

        if (text.startsWith("### ")) {
          return (
            <h3 key={i} className="pt-2 text-[19px] font-semibold tracking-[-0.01em] text-ink">
              {renderInline(text.slice(4))}
            </h3>
          );
        }
        if (text.startsWith("## ")) {
          return (
            <h2 key={i} className="pt-6 text-[clamp(1.375rem,2.5vw,1.75rem)] font-semibold tracking-[-0.015em] text-ink">
              {renderInline(text.slice(3))}
            </h2>
          );
        }
        if (text.startsWith("> ")) {
          return (
            <blockquote
              key={i}
              className="border-l-2 border-accent bg-alt px-5 py-4 text-[16px] leading-relaxed text-ink-soft italic"
            >
              {text
                .split("\n")
                .map((line) => line.replace(/^>\s?/, ""))
                .map((line, j) => (
                  <p key={j} className={j ? "mt-2" : undefined}>
                    {renderInline(line)}
                  </p>
                ))}
            </blockquote>
          );
        }

        const lines = text.split("\n");
        const isBullet = lines.every((l) => /^\s*[-*] /.test(l));
        const isNumbered = lines.every((l) => /^\s*\d+\. /.test(l));

        if (isBullet) {
          return (
            <ul key={i} className="space-y-2.5">
              {lines.map((line, j) => (
                <li key={j} className="flex gap-3 text-[16.5px] leading-relaxed text-ink-soft">
                  <span aria-hidden className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{renderInline(line.replace(/^\s*[-*] /, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (isNumbered) {
          return (
            <ol key={i} className="space-y-2.5">
              {lines.map((line, j) => (
                <li key={j} className="flex gap-3 text-[16.5px] leading-relaxed text-ink-soft">
                  <span className="mt-[1px] w-5 shrink-0 text-[15px] font-semibold text-accent">
                    {line.match(/^\s*(\d+)\./)?.[1]}.
                  </span>
                  <span>{renderInline(line.replace(/^\s*\d+\. /, ""))}</span>
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={i} className="text-[16.5px] leading-[1.75] text-ink-soft">
            {renderInline(text)}
          </p>
        );
      })}
    </div>
  );
}
