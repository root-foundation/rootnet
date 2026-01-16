import type { Metadata } from "next";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import {
  LANDING_CONFIG,
  type LandingConfig,
  type LandingLink,
} from "@/lib/landing";
import { getContentMetaBySlug, getOverviewMarkdown } from "@/lib/content";
import { LinkPill } from "@/app/_components/LinkPill";
import { MarkdownBody } from "@/app/_components/MarkdownArticle";

export const metadata: Metadata = {
  title: "rootnet",
};

export const runtime = "nodejs";
export const dynamic = "force-static";
export const revalidate = false;

export default async function Home() {
  const config = LANDING_CONFIG;
  const metaBySlug = await getLandingMetaBySlug(config);
  const overviewMarkdown = await getOverviewMarkdown();

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.hero}>
          <img src="/rootnet-logo.svg" alt="rootnet" style={styles.logo} />

          <div style={styles.heroHeadlineBlock}>
            {config.heroKickerLines?.length ? (
              <div style={styles.heroKicker}>
                {config.heroKickerLines.map((line, idx) => (
                  <span key={`${idx}:${line}`} style={styles.heroKickerLine}>
                    {line}
                  </span>
                ))}
              </div>
            ) : null}

            <h1 style={styles.heroTitle} data-hero-title>
              {config.heroTitleLines.map((line, idx) => (
                <span key={`${idx}:${line}`} style={styles.heroTitleLine}>
                  {line}
                </span>
              ))}
            </h1>

            <div style={styles.overviewWrap}>
              <MarkdownBody markdown={overviewMarkdown} />
            </div>
          </div>

          {config.heroCaptionLines?.length ? (
            <div style={styles.heroCaption}>
              {config.heroCaptionLines.map((line, idx) => (
                <span key={`${idx}:${line}`} style={styles.heroCaptionLine}>
                  {line}
                </span>
              ))}
            </div>
          ) : null}

          <div style={styles.heroDivider} />
        </header>

        <div style={styles.sections}>
          {config.sections.map((section, idx) => {
            if (section.kind === "story") {
              return (
                <Fragment key={`${idx}:${section.title}`}>
                  {idx === 0 ? null : <div style={styles.sectionDivider} />}
                  <Section title={section.title}>
                    <div style={styles.storyGroups}>
                      {section.groups.map((group, groupIdx) => (
                        <LinkList
                          key={`${groupIdx}`}
                          links={group}
                          metaBySlug={metaBySlug}
                          emptyFallback={
                            groupIdx === 0
                              ? "(add your first story group)"
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  </Section>
                </Fragment>
              );
            }

            return (
              <Fragment key={`${idx}:${section.title}`}>
                {idx === 0 ? null : <div style={styles.sectionDivider} />}
                <Section title={section.title}>
                  <LinkList
                    links={section.links}
                    metaBySlug={metaBySlug}
                    emptyFallback="(empty)"
                  />
                </Section>
              </Fragment>
            );
          })}
        </div>
      </div>
    </main>
  );
}

async function getLandingMetaBySlug(config: LandingConfig) {
  const allLinks: LandingLink[] = [];

  for (const section of config.sections) {
    if (section.kind === "story") {
      for (const group of section.groups) allLinks.push(...group);
      continue;
    }
    allLinks.push(...section.links);
  }

  const uniqueSlugs = [...new Set(allLinks.map((l) => l.slug))];

  const pairs = await Promise.all(
    uniqueSlugs.map(async (slug) => {
      try {
        const meta = await getContentMetaBySlug(slug);
        return [
          slug,
          { title: meta.title, profileSrc: meta.profileSrc },
        ] as const;
      } catch {
        return [slug, { title: humanizeSlug(slug) }] as const;
      }
    })
  );

  return new Map<string, { title: string; profileSrc?: string }>(pairs);
}

function humanizeSlug(slug: string) {
  const parts = slug
    .split("/")
    .filter(Boolean)
    .map((p) =>
      p
        .replace(/[-_]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase())
    )
    .filter(Boolean);
  return parts.join(" / ");
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const normalizedTitle = title.trim().toLowerCase();
  const hideTitle =
    normalizedTitle === "personal token" || normalizedTitle === "about";

  return (
    <section style={styles.section}>
      {hideTitle ? null : <div style={styles.sectionTitle}>{title}</div>}
      <div style={styles.sectionBody}>{children}</div>
    </section>
  );
}

function LinkList({
  links,
  metaBySlug,
  emptyFallback,
}: {
  links: LandingLink[];
  metaBySlug: Map<string, { title: string; profileSrc?: string }>;
  emptyFallback?: string;
}) {
  if (!links.length) {
    return emptyFallback ? (
      <div style={styles.emptyHint}>{emptyFallback}</div>
    ) : null;
  }

  return (
    <div style={styles.linkList}>
      {links.map((link, idx) => {
        const meta = metaBySlug.get(link.slug);
        const title =
          link.titleOverride || meta?.title || humanizeSlug(link.slug);
        const hasProfilePic = Boolean(meta?.profileSrc);
        const href = link.href || `/${link.slug}`;
        const isExternal = isExternalHref(href);
        return (
          <LinkPill
            key={`${idx}:${link.slug}`}
            href={href}
            hasProfilePic={hasProfilePic}
            isExternal={isExternal}
          >
            <span style={styles.linkPillContent}>
              <span style={styles.linkPillInner}>
                {meta?.profileSrc ? (
                  <img
                    src={meta.profileSrc}
                    alt=""
                    aria-hidden
                    style={styles.linkPillAvatar}
                  />
                ) : null}
                <span style={styles.linkPillTitle}>{title}</span>
              </span>
              {isExternal ? (
                <span style={styles.externalIconWrap} aria-hidden="true">
                  <ExternalArrowIcon />
                </span>
              ) : null}
            </span>
          </LinkPill>
        );
      })}
    </div>
  );
}

function isExternalHref(href: string) {
  return (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function ExternalArrowIcon() {
  return (
    <svg
      data-testid="geist-icon"
      height="14"
      width="14"
      viewBox="0 0 16 16"
      strokeLinejoin="round"
      style={styles.externalIcon}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.75001 2H5.00001V3.5H5.75001H11.4393L2.21968 12.7197L1.68935 13.25L2.75001 14.3107L3.28034 13.7803L12.4988 4.56182V10.25V11H13.9988V10.25V3C13.9988 2.44772 13.5511 2 12.9988 2H5.75001Z"
        fill="currentColor"
      />
    </svg>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    color: "#111111",
    padding: "72px 24px 96px",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: 510,
  },
  hero: {
    textAlign: "left",
    marginBottom: 40,
  },
  logo: {
    width: 64,
    height: 64,
    display: "block",
    marginBottom: 48,
  },
  heroHeadlineBlock: {
    marginBottom: 24,
  },
  heroKicker: {
    margin: "0 0 8px",
    fontSize: "clamp(26px, 4.6vw, 32px)",
    lineHeight: "clamp(30px, 5.2vw, 38px)",
    fontWeight: 360,
    letterSpacing: "-0.04em",
    color: "rgba(17, 17, 17, 0.5)",
    pointerEvents: "auto",
  },
  heroKickerLine: {
    display: "block",
  },
  heroTitle: {
    margin: 0,
    fontSize: "clamp(26px, 4.6vw, 32px)",
    lineHeight: "clamp(30px, 5.2vw, 38px)",
    fontWeight: 420,
    letterSpacing: "-0.04em",
    color: "#111111",
    pointerEvents: "auto",
  },
  heroTitleLine: {
    display: "block",
  },
  overviewWrap: {
    marginTop: 24,
  },
  heroCaption: {
    marginTop: 0,
    fontSize: "clamp(20px, 3.6vw, 24px)",
    lineHeight: "clamp(26px, 4.4vw, 32px)",
    fontWeight: 415,
    letterSpacing: "-0.02em",
    color: "rgba(17, 17, 17, 0.5)",
    pointerEvents: "auto",
  },
  heroCaptionLine: {
    display: "block",
  },
  heroDivider: {
    height: 1,
    background: "rgba(0, 0, 0, 0.06)",
    margin: "40px 0 0",
  },
  sections: {
    display: "flex",
    flexDirection: "column",
  },
  sectionDivider: {
    height: 1,
    background: "rgba(0, 0, 0, 0.06)",
    margin: "40px 0",
  },
  section: {},
  sectionTitle: {
    fontSize: "1rem",
    lineHeight: "1.25rem",
    fontWeight: 500,
    letterSpacing: "-0.02em",
    color: "rgba(0, 0, 0, 0.3)",
    marginBottom: 24,
    textTransform: "lowercase",
  },
  sectionBody: {},
  linkList: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  linkPillContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    width: "100%",
    minWidth: 0,
  },
  linkPillInner: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },
  linkPillAvatar: {
    width: 30,
    height: 30,
    borderRadius: 999,
    objectFit: "cover",
    flex: "0 0 auto",
    display: "block",
    background: "rgba(0, 0, 0, 0.04)",
  },
  linkPillTitle: {
    display: "block",
    fontWeight: 460,
    // Avoid clipping descenders (e.g. "g") while still matching the visual rhythm.
    lineHeight: "1.25rem",
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  externalIconWrap: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    height: 20,
    width: 20,
    color: "rgba(0, 0, 0, 0.2)",
  },
  externalIcon: {
    display: "block",
    color: "currentColor",
    pointerEvents: "none",
  },
  storyGroups: {
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  groupDivider: {
    height: 1,
    background: "rgba(0, 0, 0, 0.06)",
    margin: "14px 0",
  },
  emptyHint: {
    fontSize: "1rem",
    lineHeight: "1.25rem",
    color: "rgba(0, 0, 0, 0.35)",
  },
};
