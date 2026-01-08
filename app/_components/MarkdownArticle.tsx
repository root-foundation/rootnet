import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { PrevNextNav, type NavLink } from "@/app/_components/PrevNextNav";
import { ReadingProgressHomeBadge } from "@/app/_components/ReadingProgressHomeBadge";

type MarkdownArticleProps = {
  title: string;
  caption?: string;
  video?: string;
  profileSrc?: string;
  previous?: NavLink | null;
  next?: NavLink | null;
  toc?: boolean;
  markdown: string;
};

export function MarkdownArticle({
  title,
  caption,
  video,
  profileSrc,
  previous,
  next,
  toc,
  markdown,
}: MarkdownArticleProps) {
  const heroVideoEmbedUrl = video ? getYouTubeEmbedUrl(video) : null;
  const normalizedCaption = normalizeOptionalCaption(caption);
  const headingIdSlugger = createHeadingIdSlugger();
  const titleId = headingIdSlugger(title);
  const tocItems =
    toc === true ? getTocItemsFromMarkdown({ title, markdown }) : [];
  const showToc = toc === true && tocItems.length > 0;

  const headerEl = (
    <header style={showToc ? styles.headerWithToc : styles.header}>
      {profileSrc ? (
        <img src={profileSrc} alt="" aria-hidden style={styles.profileImg} />
      ) : null}
      <h1 id={titleId} style={styles.h1}>
        {title}
      </h1>
      {normalizedCaption ? (
        <p style={styles.caption}>{normalizedCaption}</p>
      ) : null}
      {heroVideoEmbedUrl ? (
        <div style={styles.heroVideoWrap}>
          <div style={styles.youtubeFrame}>
            <iframe
              src={heroVideoEmbedUrl}
              title="YouTube video"
              style={styles.youtubeIframe}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      ) : null}
    </header>
  );

  const tocEl = showToc ? (
    <nav
      aria-label="Table of contents"
      className="rn-article-toc"
      style={styles.toc}
    >
      <div style={styles.tocInner}>
        {tocItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="rn-article-tocLink"
            style={styles.tocLink}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  ) : null;

  return (
    <main style={styles.page}>
      <ReadingProgressHomeBadge targetId="essay-article" />
      <article
        id="essay-article"
        className={showToc ? "rn-article-layout" : undefined}
        style={showToc ? styles.articleWithToc : styles.article}
      >
        {headerEl}
        {tocEl}

        <div style={showToc ? styles.contentWithToc : styles.content}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Rule: top heading is the page title (from frontmatter/filename).
              // Any markdown H1 inside the body should render as an H2.
              h1: ({ node: _node, children, ...props }) => {
                const id = headingIdSlugger(getTextFromReactNode(children));
                return (
                  <h2 style={styles.h2} {...props} id={id}>
                    {children}
                  </h2>
                );
              },
              // Rule: other headings are H2s.
              h2: ({ node: _node, children, ...props }) => {
                const id = headingIdSlugger(getTextFromReactNode(children));
                return (
                  <h2 style={styles.h2} {...props} id={id}>
                    {children}
                  </h2>
                );
              },
              // Rule: H3 should look like body text, just 500 weight.
              h3: ({ node: _node, children, ...props }) => {
                const id = headingIdSlugger(getTextFromReactNode(children));
                return (
                  <h3 style={styles.h3AsBody} {...props} id={id}>
                    {children}
                  </h3>
                );
              },
              h4: ({ node: _node, children, ...props }) => {
                const id = headingIdSlugger(getTextFromReactNode(children));
                return (
                  <h4 style={styles.h3AsBody} {...props} id={id}>
                    {children}
                  </h4>
                );
              },
              h5: ({ node: _node, children, ...props }) => {
                const id = headingIdSlugger(getTextFromReactNode(children));
                return (
                  <h5 style={styles.h3AsBody} {...props} id={id}>
                    {children}
                  </h5>
                );
              },
              h6: ({ node: _node, children, ...props }) => {
                const id = headingIdSlugger(getTextFromReactNode(children));
                return (
                  <h6 style={styles.h3AsBody} {...props} id={id}>
                    {children}
                  </h6>
                );
              },
              p: ({ node, ...props }) => {
                const standaloneUrl = getStandaloneUrlFromParagraphNode(node);
                const embedUrl = standaloneUrl
                  ? getYouTubeEmbedUrl(standaloneUrl)
                  : null;

                if (embedUrl) {
                  return (
                    <div style={styles.youtubeWrap}>
                      <div style={styles.youtubeFrame}>
                        <iframe
                          src={embedUrl}
                          title="YouTube video"
                          style={styles.youtubeIframe}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  );
                }

                return <p style={styles.p} {...props} />;
              },
              ul: ({ node: _node, ...props }) => (
                <ul style={styles.ul} {...props} />
              ),
              ol: ({ node: _node, ...props }) => (
                <ol style={styles.ol} {...props} />
              ),
              li: (liProps) => {
                const { node: _node, children, ...props } = liProps;
                // `react-markdown` provides `ordered` at runtime, but the published types
                // don’t include it on the `li` renderer props.
                const ordered = Boolean(
                  (liProps as unknown as { ordered?: boolean }).ordered
                );
                const normalizedChildren = React.Children.map(
                  children,
                  (child) => {
                    // ReactMarkdown commonly wraps list item content in a <p>.
                    // Our paragraph style has a large bottom margin that makes list
                    // spacing look wrong, so we zero it out inside list items.
                    if (React.isValidElement(child) && child.type === "p") {
                      const childProps = (
                        child as React.ReactElement<{
                          style?: React.CSSProperties;
                        }>
                      ).props;
                      return React.cloneElement(
                        child as React.ReactElement<
                          React.HTMLAttributes<HTMLParagraphElement>
                        >,
                        {
                          style: {
                            ...(childProps.style ?? {}),
                            ...styles.pInListItem,
                          },
                        }
                      );
                    }
                    return child;
                  }
                );

                if (ordered) {
                  return (
                    <li style={styles.liOrdered} {...props}>
                      {normalizedChildren}
                    </li>
                  );
                }

                return (
                  <li style={styles.liUnordered} {...props}>
                    <span aria-hidden style={styles.liDash}>
                      <DashIcon />
                    </span>
                    <span style={styles.liBody}>{normalizedChildren}</span>
                  </li>
                );
              },
              blockquote: ({ node: _node, ...props }) => (
                <blockquote style={styles.blockquote} {...props} />
              ),
              strong: ({ node: _node, ...props }) => (
                <strong style={styles.strong} {...props} />
              ),
              a: ({ href, node: _node, ...props }) => (
                <a
                  href={href}
                  style={styles.a}
                  target={href?.startsWith("#") ? undefined : "_blank"}
                  rel={href?.startsWith("#") ? undefined : "noreferrer"}
                  {...props}
                />
              ),
              code: ({ children, node: _node, ...props }) => (
                <code style={styles.codeInline} {...props}>
                  {children}
                </code>
              ),
              pre: ({ node: _node, ...props }) => (
                <pre style={styles.pre} {...props} />
              ),
              table: ({ node: _node, ...props }) => (
                <div style={styles.tableWrap}>
                  <table style={styles.table} {...props} />
                </div>
              ),
              th: ({ node: _node, ...props }) => (
                <th style={styles.th} {...props} />
              ),
              td: ({ node: _node, ...props }) => (
                <td style={styles.td} {...props} />
              ),
              hr: ({ node: _node, ...props }) => (
                <hr style={styles.hr} {...props} />
              ),
            }}
          >
            {markdown || ""}
          </ReactMarkdown>

          <PrevNextNav previous={previous ?? null} next={next ?? null} />
        </div>
      </article>
    </main>
  );
}

type TocItem = { id: string; label: string };

function getTocItemsFromMarkdown(input: {
  title: string;
  markdown: string;
}): TocItem[] {
  const { title, markdown } = input;
  const headingIdSlugger = createHeadingIdSlugger();

  // Keep the slugger in sync with rendered IDs.
  // The article title reserves the first slug.
  headingIdSlugger(title);

  const out: TocItem[] = [];
  const headings = extractMarkdownAtxHeadings(markdown);

  for (const h of headings) {
    const label = stripInlineMarkdown(h.text).trim();
    if (!label) continue;
    const id = headingIdSlugger(label);
    if (h.depth === 2) out.push({ id, label });
  }

  return out;
}

function extractMarkdownAtxHeadings(
  markdown: string
): Array<{ depth: number; text: string }> {
  const out: Array<{ depth: number; text: string }> = [];
  const lines = String(markdown ?? "").split(/\r?\n/);

  // Ignore headings inside fenced code blocks.
  let inFence: false | { marker: "```" | "~~~" } = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (!inFence) inFence = { marker: "```" };
      else if (inFence.marker === "```") inFence = false;
      continue;
    }
    if (trimmed.startsWith("~~~")) {
      if (!inFence) inFence = { marker: "~~~" };
      else if (inFence.marker === "~~~") inFence = false;
      continue;
    }
    if (inFence) continue;

    // ATX heading: "#", "##", ... "######"
    const m = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (!m?.[1] || !m?.[2]) continue;

    const depth = m[1].length;
    const withoutClosingHashes = m[2].replace(/\s+#+\s*$/, "").trim();
    if (!withoutClosingHashes) continue;
    out.push({ depth, text: withoutClosingHashes });
  }

  return out;
}

function stripInlineMarkdown(input: string): string {
  // Aim: approximate the visible heading text that react-markdown will render.
  // Keep this intentionally simple.
  return String(input ?? "")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1") // images -> alt text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links -> label
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1") // italics
    .replace(/__([^_]+)__/g, "$1") // bold
    .replace(/_([^_]+)_/g, "$1") // italics
    .replace(/~~([^~]+)~~/g, "$1"); // strikethrough
}

function DashIcon() {
  return (
    <svg
      height="16"
      width="16"
      viewBox="0 0 16 16"
      strokeLinejoin="round"
      aria-hidden
      focusable="false"
      style={styles.liDashIcon}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 7.25H2.75H13.25H14V8.75H13.25H2.75H2V7.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

function getStandaloneUrlFromParagraphNode(node: unknown): string | null {
  // Only embed if the paragraph contains exactly one child:
  // - a text node containing a URL, or
  // - a single anchor whose href is a URL (GFM autolinks / markdown links)
  if (!node || typeof node !== "object") return null;

  const children = (node as { children?: unknown }).children;
  if (!Array.isArray(children) || children.length !== 1) return null;

  const only = children[0];
  if (!only || typeof only !== "object") return null;

  const onlyRec = only as Record<string, unknown>;

  // Plain text: "https://youtube.com/watch?v=..."
  if (onlyRec.type === "text" && typeof onlyRec.value === "string") {
    const url = onlyRec.value.trim();
    return url.length > 0 ? url : null;
  }

  // Single link: <a href="...">...</a>
  if (
    onlyRec.type === "element" &&
    onlyRec.tagName === "a" &&
    typeof onlyRec.properties === "object" &&
    onlyRec.properties !== null &&
    typeof (onlyRec.properties as Record<string, unknown>).href === "string"
  ) {
    const href = String(
      (onlyRec.properties as Record<string, unknown>).href
    ).trim();
    return href.length > 0 ? href : null;
  }

  return null;
}

function normalizeOptionalCaption(input?: string): string | null {
  if (typeof input !== "string") return null;
  // Protect layout from "invisible" captions (e.g. zero-width spaces) that still
  // render an empty <p> and reserve vertical space.
  const hasVisibleChars =
    input.replace(/[\s\u200B\u200C\u200D\uFEFF]/g, "").length > 0;
  if (!hasVisibleChars) return null;
  return input.trim();
}

function getTextFromReactNode(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(getTextFromReactNode).join("");
  if (React.isValidElement(node)) {
    const el = node as React.ReactElement<{ children?: React.ReactNode }>;
    return getTextFromReactNode(el.props.children);
  }
  return "";
}

function createHeadingIdSlugger(): (rawHeadingText: string) => string {
  const counts = new Map<string, number>();

  return (rawHeadingText: string) => {
    const base = slugifyHeadingText(rawHeadingText);
    const prev = counts.get(base) ?? 0;
    const next = prev + 1;
    counts.set(base, next);
    if (next === 1) return base;
    return `${base}-${next}`;
  };
}

function slugifyHeadingText(input: string): string {
  // "Common sense" slug rules:
  // - lowercase
  // - remove punctuation
  // - spaces -> dashes
  // - collapse multiple dashes
  // - keep ASCII letters/numbers (strip diacritics)
  const normalized = String(input ?? "")
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, ""); // strip combining marks

  const lower = normalized.toLowerCase().replace(/&/g, " and ");

  // Keep only alphanumerics, whitespace, and dashes/underscores (underscores become dashes).
  const cleaned = lower
    .replace(/['’]/g, "") // drop apostrophes
    .replace(/[^a-z0-9\s_-]/g, " ")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleaned || "section";
}

const H2_MARGIN_TOP_PX = 48;
// Visual alignment tweak: the first H2's margin/baseline renders slightly lower
// than the TOC list start, so we nudge the TOC down a bit.
const TOC_ALIGN_TO_FIRST_H2_PX = 8;

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    color: "#111111",
    padding: "192px 24px 96px",
    display: "flex",
    justifyContent: "center",
  },
  articleWithToc: {
    width: "100%",
    maxWidth: 980,
  },
  toc: {
    position: "sticky",
    top: 192,
    alignSelf: "start",
    // Hidden by default; displayed via media query only on desktop.
    display: "none",
    gridColumn: 1,
    gridRow: 2,
  },
  tocInner: {
    // Align first TOC item with the first rendered H2 text (which has a top margin).
    paddingTop: H2_MARGIN_TOP_PX + TOC_ALIGN_TO_FIRST_H2_PX,
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
  article: {
    width: "100%",
    maxWidth: 600,
  },
  header: {
    marginBottom: 96,
    textAlign: "left",
  },
  headerWithToc: {
    marginBottom: 96,
    textAlign: "left",
    gridColumn: 2,
    gridRow: 1,
  },
  profileImg: {
    width: 128,
    height: 128,
    borderRadius: 999,
    objectFit: "cover",
    display: "block",
    marginBottom: 20,
    background: "rgba(0, 0, 0, 0.04)",
  },
  h1: {
    fontSize: 48,
    lineHeight: "56px",
    // Double-tighten vs Figma "-2%" to match visual spacing in-browser.
    letterSpacing: "-0.06em",
    fontWeight: 300,
    margin: 0,
    color: "#111111",
  },
  caption: {
    margin: "24px 0 0",
    fontSize: 24,
    lineHeight: "32px",
    fontWeight: 420,
    color: "rgba(0, 0, 0, 0.6)",
    opacity: 0.6,
    letterSpacing: "-0.03em",
  },
  heroVideoWrap: {
    marginTop: 72,
  },
  content: {
    width: "100%",
    fontSize: 16,
    lineHeight: "24px",
    fontWeight: 420,
    color: "#111111",
    letterSpacing: "-0.015em",
  },
  contentWithToc: {
    width: "100%",
    maxWidth: 600,
    fontSize: 16,
    lineHeight: "24px",
    fontWeight: 420,
    color: "#111111",
    letterSpacing: "-0.015em",
    gridColumn: 2,
    gridRow: 2,
  },
  h2: {
    fontSize: 20,
    lineHeight: "32px",
    marginTop: H2_MARGIN_TOP_PX,
    marginBottom: 24,
    fontWeight: 480,
    // Figma letter-spacing "-2%" ≈ CSS letter-spacing "-0.02em"
    letterSpacing: "-0.02em",
    color: "#111111",
  },
  h3AsBody: {
    fontSize: 16,
    lineHeight: "24px",
    // We assume H3s are preceded by a divider (hr), so the divider controls the top spacing.
    marginTop: 0,
    marginBottom: 24,
    fontWeight: 580,
    color: "#111111",
  },
  p: {
    margin: "0 0 24px",
    color: "#111111",
  },
  pInListItem: {
    margin: 0,
  },
  ul: {
    // Keep spacing symmetric with paragraphs: prev->list == list->next == 24px.
    margin: "0 0 24px",
    marginTop: -16,
    // List items manage their own marker gutter.
    paddingLeft: 24,
    listStyle: "none",
  },
  ol: {
    // Keep spacing symmetric with paragraphs: prev->list == list->next == 24px.
    margin: "0 0 24px",
    marginTop: -16,
    paddingLeft: 22,
  },
  liOrdered: {
    margin: "0px 0",
  },
  liUnordered: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    margin: "0px 0",
  },
  liDash: {
    color: "rgba(0,0,0,0.6)",
    flex: "0 0 22px",
    width: 22,
    // Vertically center within the first line-height (24px).
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  liDashIcon: {
    display: "block",
    color: "currentColor",
  },
  liBody: {
    display: "block",
    flex: "1 1 auto",
    minWidth: 0,
  },
  blockquote: {
    margin: "0 0 24px",
    padding: 0,
    borderLeft: "none",
    background: "transparent",
    borderRadius: 0,
    color: "#111111",
    opacity: 0.45,
    letterSpacing: "-0.02em",
    fontStyle: "italic",
    fontWeight: 420,
  },
  strong: {
    fontWeight: 580,
  },
  a: {
    color: "#111111",
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
  codeInline: {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: "0.92em",
    padding: "0.15em 0.35em",
    borderRadius: 8,
    border: "1px solid rgba(127,127,127,0.25)",
    background: "rgba(127,127,127,0.12)",
  },
  pre: {
    margin: "16px 0",
    padding: 14,
    overflowX: "auto",
    borderRadius: 12,
    border: "1px solid rgba(127,127,127,0.25)",
    background: "rgba(127,127,127,0.10)",
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: 13,
    lineHeight: "22px",
    color: "#111111",
  },
  tableWrap: {
    width: "100%",
    overflowX: "auto",
    margin: "16px 0",
    borderRadius: 12,
    border: "1px solid rgba(127,127,127,0.25)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "10px 12px",
    borderBottom: "1px solid rgba(127,127,127,0.25)",
    background: "rgba(127,127,127,0.08)",
    color: "#111111",
  },
  td: {
    padding: "10px 12px",
    borderBottom: "1px solid rgba(127,127,127,0.18)",
    color: "#111111",
  },
  hr: {
    border: "none",
    borderTop: "1px solid rgba(0, 0, 0, 0.05)",
    // Keep spacing symmetric: above divider == divider->H3 == H3->next paragraph == 24px.
    margin: "24px 0",
  },
  youtubeWrap: {
    margin: "0 0 24px",
  },
  youtubeFrame: {
    position: "relative",
    width: "100%",
    paddingTop: "56.25%", // 16:9
    background: "rgba(0,0,0,0.04)",
    borderRadius: 12,
    overflow: "hidden",
  },
  youtubeIframe: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },
};
