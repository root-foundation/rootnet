"use client";

import Link from "next/link";
import React from "react";

export function LinkPill({
  href,
  children,
  ariaLabel,
  hasProfilePic,
}: {
  href: string;
  children: React.ReactNode;
  ariaLabel?: string;
  hasProfilePic?: boolean;
}) {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [isPressed, setIsPressed] = React.useState(false);
  const lastInteractionRef = React.useRef<"mouse" | "keyboard" | null>(null);

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      style={{
        ...styles.base,
        ...(hasProfilePic ? styles.withProfilePic : styles.withoutProfilePic),
        ...(isHovered ? styles.hover : null),
        ...(isPressed ? styles.pressed : null),
        ...(isFocused ? styles.focus : null),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => {
        lastInteractionRef.current = "mouse";
        setIsPressed(true);
      }}
      onMouseUp={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onKeyDown={(e) => {
        lastInteractionRef.current = "keyboard";
        // Provide "click" affordance for keyboard activation.
        if (e.key === "Enter" || e.key === " ") setIsPressed(true);
      }}
      onKeyUp={() => setIsPressed(false)}
      onFocus={() => {
        // Prevent the “click focus ring” while keeping a visible ring for keyboard navigation.
        setIsFocused(lastInteractionRef.current === "keyboard");
      }}
      onBlur={() => {
        setIsFocused(false);
        setIsPressed(false);
      }}
    >
      {children}
    </Link>
  );
}

const styles: Record<string, React.CSSProperties> = {
  base: {
    display: "flex",
    alignItems: "center",
    // "Bleed" left/right so hover/press background extends beyond the content boundary,
    // while the text stays aligned with the parent container.
    width: "calc(100% + 24px)",
    marginLeft: -12,
    marginRight: -12,
    borderRadius: 8,
    background: "transparent",
    color: "#111111",
    textDecoration: "none",
    outline: "none",
    fontSize: "1rem",
    lineHeight: "1.25rem",
    fontWeight: 500,
    letterSpacing: "-0.01em",
    transition:
      "background 140ms ease, border-color 140ms ease, box-shadow 140ms ease",
  },
  withoutProfilePic: {
    padding: "8px 12px",
  },
  withProfilePic: {
    padding: "8px 12px",
  },
  hover: {
    background: "rgba(0, 0, 0, 0.02)",
    borderColor: "rgba(0, 0, 0, 0.08)",
  },
  pressed: {
    background: "rgba(0, 0, 0, 0.04)",
  },
  focus: {
    boxShadow: "0 0 0 3px rgba(0, 0, 0, 0.10)",
  },
};
