"use client";

import Link from "next/link";
import React from "react";

export type NavLink = {
  slug: string;
  title: string;
};

type PrevNextNavProps = {
  previous?: NavLink | null;
  next?: NavLink | null;
};

export function PrevNextNav({ previous, next }: PrevNextNavProps) {
  const [hovered, setHovered] = React.useState<"prev" | "next" | null>(null);

  if (!previous && !next) return null;

  return (
    <nav style={styles.wrap} aria-label="Article navigation">
      <div style={styles.row}>
        <div style={styles.cell}>
          {previous ? (
            <NavItem
              kind="prev"
              href={`/${previous.slug}`}
              title={previous.title}
              isHovered={hovered === "prev"}
              onHoverChange={(v) => setHovered(v ? "prev" : null)}
            />
          ) : null}
        </div>

        <div style={styles.cellRight}>
          {next ? (
            <NavItem
              kind="next"
              href={`/${next.slug}`}
              title={next.title}
              isHovered={hovered === "next"}
              onHoverChange={(v) => setHovered(v ? "next" : null)}
            />
          ) : null}
        </div>
      </div>
    </nav>
  );
}

function NavItem({
  kind,
  href,
  title,
  isHovered,
  onHoverChange,
}: {
  kind: "prev" | "next";
  href: string;
  title: string;
  isHovered: boolean;
  onHoverChange: (hovered: boolean) => void;
}) {
  const isPrev = kind === "prev";

  return (
    <Link
      href={href}
      title={title}
      style={{
        ...styles.link,
        opacity: isHovered ? 0.72 : 0.4,
        transform: isHovered
          ? `translateX(${isPrev ? -2 : 2}px)`
          : "translateX(0px)",
      }}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
    >
      <div
        style={{
          ...styles.titleRow,
          justifyContent: isPrev ? "flex-start" : "flex-end",
        }}
      >
        {isPrev ? (
          <>
            <span style={styles.arrowIconWrap} aria-hidden="true">
              <ArrowLeftIcon />
            </span>
            <span style={{ ...styles.title, textAlign: "left" }}>{title}</span>
          </>
        ) : (
          <>
            <span style={{ ...styles.title, textAlign: "right" }}>{title}</span>
            <span style={styles.arrowIconWrap} aria-hidden="true">
              <ArrowRightIcon />
            </span>
          </>
        )}
      </div>
    </Link>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      data-testid="geist-icon"
      height="14"
      width="14"
      viewBox="0 0 16 16"
      strokeLinejoin="round"
      style={styles.arrowIcon}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      data-testid="geist-icon"
      height="14"
      width="14"
      viewBox="0 0 16 16"
      strokeLinejoin="round"
      style={styles.arrowIcon}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.5 14.0607L9.96966 13.5303L5.14644 8.7071C4.75592 8.31658 4.75592 7.68341 5.14644 7.29289L9.96966 2.46966L10.5 1.93933L11.5607 2.99999L11.0303 3.53032L6.56065 7.99999L11.0303 12.4697L11.5607 13L10.5 14.0607Z"
        fill="currentColor"
      />
    </svg>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    marginTop: 72,
    paddingTop: 24,
    borderTop: "1px solid rgba(0, 0, 0, 0.05)",
  },
  row: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-between",
    gap: 16,
  },
  cell: {
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
  },
  cellRight: {
    flex: 1,
    minWidth: 0,
    display: "flex",
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  link: {
    display: "block",
    color: "#111111",
    textDecoration: "none",
    transition: "opacity 120ms ease, transform 120ms ease",
    willChange: "opacity, transform",
    maxWidth: "100%",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    minWidth: 0,
  },
  arrowIconWrap: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    height: 20,
    width: 20,
  },
  arrowIcon: {
    display: "block",
    color: "currentColor",
  },
  title: {
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 500,
    flex: "1 1 auto",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};


