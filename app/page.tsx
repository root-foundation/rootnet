import type { Metadata } from "next";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import {
  LANDING_CONFIG,
  type LandingConfig,
  type LandingLink,
} from "@/lib/landing";
import { getContentMetaBySlug } from "@/lib/content";
import { LinkPill } from "@/app/_components/LinkPill";

export const metadata: Metadata = {
  title: "rootnet",
};

export default async function Home() {
  const config = LANDING_CONFIG;
  const metaBySlug = await getLandingMetaBySlug(config);

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <header style={styles.hero}>
          <img src="/rootnet-logo.svg" alt="rootnet" style={styles.logo} />

          <h1 style={styles.heroTitle}>
            {config.heroTitleLines.map((line, idx) => (
              <span key={`${idx}:${line}`} style={styles.heroTitleLine}>
                {line}
              </span>
            ))}
          </h1>

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
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={styles.section}>
      <div style={styles.sectionTitle}>{title}</div>
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
        return (
          <LinkPill
            key={`${idx}:${link.slug}`}
            href={`/${link.slug}`}
            hasProfilePic={hasProfilePic}
          >
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
          </LinkPill>
        );
      })}
    </div>
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
    maxWidth: 600,
  },
  hero: {
    textAlign: "left",
    marginBottom: 40,
  },
  logo: {
    width: 44,
    height: 44,
    display: "block",
    // Must be 2x the gap between hero title and hero caption.
    marginBottom: 48,
  },
  heroTitle: {
    margin: 0,
    fontSize: 42,
    lineHeight: "48px",
    fontWeight: 400,
    letterSpacing: "-0.06em",
    color: "#111111",
    pointerEvents: "auto",
  },
  heroTitleLine: {
    display: "block",
  },
  heroCaption: {
    marginTop: 24,
    fontSize: 24,
    lineHeight: "32px",
    fontWeight: 400,
    letterSpacing: "-0.03em",
    color: "#5E5E5E",
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
  linkPillInner: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
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
    lineHeight: "1rem",
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
