"use client";

import Link from "next/link";
import React from "react";

export function ReadingProgressHomeBadge({
  targetId,
  ariaLabel = "Home",
}: {
  targetId: string;
  ariaLabel?: string;
}) {
  const [progress, setProgress] = React.useState(0);
  const rafRef = React.useRef<number | null>(null);

  const updateProgress = React.useCallback(() => {
    const el = document.getElementById(targetId);

    if (!el) {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      setProgress(Math.min(1, Math.max(0, window.scrollY / max)));
      return;
    }

    const rect = el.getBoundingClientRect();
    const elTop = rect.top + window.scrollY;
    const elHeight = el.offsetHeight;
    const viewportHeight = window.innerHeight;

    const start = elTop;
    const end = elTop + Math.max(1, elHeight - viewportHeight);

    const raw = (window.scrollY - start) / (end - start);
    setProgress(Math.min(1, Math.max(0, raw)));
  }, [targetId]);

  React.useEffect(() => {
    const onScrollOrResize = () => {
      if (rafRef.current != null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        updateProgress();
      });
    };

    updateProgress();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [updateProgress]);

  // Simple: a circular avatar with an SVG stroke ring around it.
  // The padding ensures the ring can never bleed into the avatar area.
  const previousOuterSize = 52;
  const scale = 0.75; // 0.75x the previous radius => 0.75x diameter too
  const ringThickness = 2.25; // circumference thickness
  const ringGap = 4;
  const padding = ringThickness + ringGap; // guarantees no overlap
  const baseOuterSize = Math.round(previousOuterSize * scale);
  const baseAvatarSize = baseOuterSize - padding * 2;
  const avatarSize = Math.round(baseAvatarSize * 1.5);
  const outerSize = Math.round(avatarSize + padding * 2);

  const r = outerSize / 2 - ringThickness / 2;
  const c = 2 * Math.PI * r;
  const dashOffset = c * (1 - progress);

  return (
    <Link href="/" aria-label={ariaLabel} style={styles.link}>
      <span style={{ ...styles.wrap, width: outerSize, height: outerSize }}>
        <svg
          width={outerSize}
          height={outerSize}
          viewBox={`0 0 ${outerSize} ${outerSize}`}
          aria-hidden
          focusable="false"
          style={styles.ringSvg}
        >
          <circle
            cx={outerSize / 2}
            cy={outerSize / 2}
            r={r}
            fill="none"
            stroke="#000000"
            strokeWidth={ringThickness}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={dashOffset}
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
        </svg>
        <span
          style={{ ...styles.avatar, width: avatarSize, height: avatarSize }}
        >
          <img
            src="/rootnet-profile.svg"
            alt=""
            aria-hidden
            style={styles.avatarImg}
          />
        </span>
      </span>
    </Link>
  );
}

const styles: Record<string, React.CSSProperties> = {
  link: {
    position: "fixed",
    top: 24,
    left: 24,
    zIndex: 50,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    borderRadius: 999,
    opacity: 0.92,
    transition: "opacity 120ms ease, transform 120ms ease",
  },
  wrap: {
    borderRadius: 999,
    display: "grid",
    placeItems: "center",
    background: "rgba(255, 255, 255, 0.72)",
    border: "1px solid rgba(0, 0, 0, 0.06)",
    boxShadow:
      "0 14px 40px rgba(0, 0, 0, 0.12), 0 2px 10px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.55)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    position: "relative",
    overflow: "visible",
  },
  ringSvg: {
    position: "absolute",
    inset: 0,
    display: "block",
    pointerEvents: "none",
  },
  avatar: {
    borderRadius: 999,
    overflow: "hidden",
    background: "rgba(255, 255, 255, 0.92)",
    position: "relative",
    display: "grid",
    placeItems: "center",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
    borderRadius: 999,
  },
};
