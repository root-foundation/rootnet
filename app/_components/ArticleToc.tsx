"use client";

import React from "react";

type TocItem = { id: string; label: string };

export function ArticleToc({
  items,
  ariaLabel = "Table of contents",
  className,
  style,
}: {
  items: TocItem[];
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const resizeTimeoutRef = React.useRef<number | null>(null);

  const updateActive = React.useCallback(() => {
    if (items.length === 0) return;

    const VIEWPORT_TOP_OFFSET_PX = 220;

    // Pick the last heading whose top has crossed the "reading line" near the top.
    let nextActive: string | null = null;
    for (const item of items) {
      const el = document.getElementById(item.id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top;
      if (top <= VIEWPORT_TOP_OFFSET_PX) nextActive = item.id;
      else break;
    }

    // If we haven't crossed any headings yet, highlight the first TOC item.
    if (!nextActive) nextActive = items[0]?.id ?? null;

    setActiveId((prev) => (prev === nextActive ? prev : nextActive));
  }, [items]);

  React.useEffect(() => {
    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        updateActive();
      });
    };

    const onResize = () => {
      if (resizeTimeoutRef.current != null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      resizeTimeoutRef.current = window.setTimeout(() => {
        resizeTimeoutRef.current = null;
        updateActive();
      }, 120);
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      if (resizeTimeoutRef.current != null) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [updateActive]);

  return (
    <nav aria-label={ariaLabel} className={className} style={style}>
      <div style={styles.tocInner}>
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rn-article-tocLink"
              aria-current={isActive ? "location" : undefined}
              style={{
                ...styles.tocLink,
                ...(isActive ? styles.tocLinkActive : null),
              }}
              onClick={() => setActiveId(item.id)}
            >
              {item.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  tocInner: {
    // Align first TOC item with the first rendered H2 text (which has a top margin).
    // Keep this in sync with `MarkdownArticle.tsx`.
    paddingTop: 48 + 8,
  },
  tocLink: {
    display: "block",
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 400,
    color: "#111111",
    opacity: 0.4,
    textDecoration: "none",
    marginBottom: 10,
    letterSpacing: "-0.01em",
  },
  tocLinkActive: {
    opacity: 1,
    fontWeight: 500,
  },
};
