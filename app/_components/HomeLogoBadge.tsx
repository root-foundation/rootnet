import Link from "next/link";
import React from "react";

export function HomeLogoBadge() {
  return (
    <Link href="/" aria-label="Go to home" style={styles.link}>
      <span style={styles.badge}>
        <img
          src="/rootnet-logo.svg"
          alt=""
          aria-hidden
          style={styles.logoImg}
        />
      </span>
    </Link>
  );
}

const BADGE_SIZE_PX = 66;

const styles: Record<string, React.CSSProperties> = {
  link: {
    position: "fixed",
    top: 16,
    left: 16,
    zIndex: 50,
    textDecoration: "none",
    WebkitTapHighlightColor: "transparent",
    touchAction: "manipulation",
  },
  badge: {
    width: BADGE_SIZE_PX,
    height: BADGE_SIZE_PX,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.62)",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.12)",
    backdropFilter: "blur(10px) saturate(160%)",
    WebkitBackdropFilter: "blur(10px) saturate(160%)",
  },
  logoImg: {
    display: "block",
    width: 33,
    height: 33,
    opacity: 0.92,
  },
};


