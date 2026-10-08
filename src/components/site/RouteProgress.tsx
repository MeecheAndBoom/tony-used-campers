"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Slim Apple-style progress bar pinned above the nav. It fills while a
 * navigation (or filter/search param change) is in flight so clicks never
 * feel like they were ignored, then completes and fades out.
 */
export function RouteProgress() {
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const clear = () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };

    const show = () => {
      clear();
      setActive(true);
      setDone(false);
      // Consider the navigation settled after a short quiet period.
      timers.current.push(
        window.setTimeout(() => {
          setDone(true);
          timers.current.push(
            window.setTimeout(() => setActive(false), 280),
          );
        }, 480),
      );
    };

    // Internal link clicks (Next handles the actual navigation).
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      if (!href || href.startsWith("#")) return;
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (/^(https?:)?\/\//i.test(href)) return; // external
      if (/^(mailto|tel):/i.test(href)) return;
      show();
    };

    const onPopState = () => show();

    // Next updates the URL through history — cover router.push/replace too.
    const origPush = history.pushState.bind(history);
    const origReplace = history.replaceState.bind(history);
    history.pushState = (...args) => {
      const result = origPush(...args);
      show();
      return result;
    };
    history.replaceState = (...args) => {
      const result = origReplace(...args);
      show();
      return result;
    };

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      clear();
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      history.pushState = origPush;
      history.replaceState = origReplace;
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] transition-opacity duration-200 ${
        active ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`h-full bg-accent transition-[width] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          done
            ? "w-full duration-250"
            : active
              ? "w-[75%] duration-[700ms]"
              : "w-0 duration-200"
        }`}
      />
    </div>
  );
}
