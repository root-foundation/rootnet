import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";

import { LANDING_CONFIG } from "@/lib/landing";

const ROOT_CONTENT_DIR = path.join(process.cwd(), "root");

export type ContentPage = {
  title: string;
  caption?: string;
  video?: string;
  profileSrc?: string;
  toc?: boolean;
  previousSlug?: string;
  nextSlug?: string;
  markdown: string;
  fileRelativePath: string; // e.g. "root/stories/personal-token.md"
};

type NavIndex = {
  sectionSlugsByKey: Map<string, string[]>;
  locationBySlug: Map<string, { sectionKey: string; index: number }>;
};

let navIndexPromise: Promise<NavIndex> | null = null;

async function getNavIndexUncached(): Promise<NavIndex> {
  if (!navIndexPromise) {
    navIndexPromise = (async () => {
      const rootIndex = await getRootIndex();

      const sectionSlugsByKey = new Map<string, string[]>();
      const locationBySlug = new Map<
        string,
        { sectionKey: string; index: number }
      >();

      const seen = new Map<string, string>(); // slug -> sectionKey

      for (
        let sectionIdx = 0;
        sectionIdx < LANDING_CONFIG.sections.length;
        sectionIdx++
      ) {
        const section = LANDING_CONFIG.sections[sectionIdx];
        const sectionKey = `${sectionIdx}:${section.kind}:${section.title}`;

        const rawSlugs =
          section.kind === "story"
            ? section.groups.flat().map((l) => l.slug)
            : section.links.map((l) => l.slug);

        // Only consider slugs that actually exist under root/.
        // This keeps navigation robust if config temporarily references missing content.
        const slugs = rawSlugs.filter((s) => rootIndex.bySlug.has(s));

        // Guard against duplicates within a section (after filtering).
        const sectionDupes = new Set<string>();
        const sectionSeen = new Set<string>();
        for (const s of slugs) {
          if (sectionSeen.has(s)) sectionDupes.add(s);
          sectionSeen.add(s);
        }
        if (sectionDupes.size > 0) {
          throw new Error(
            `Duplicate slug(s) in landing config section "${section.title}": ${[
              ...sectionDupes,
            ].join(", ")}`
          );
        }

        sectionSlugsByKey.set(sectionKey, slugs);

        for (let i = 0; i < slugs.length; i++) {
          const slug = slugs[i];
          const existing = seen.get(slug);
          if (existing) {
            throw new Error(
              `Slug "${slug}" appears in multiple landing config sections ("${existing}" and "${sectionKey}"). Navigation requires each slug to belong to exactly one section.`
            );
          }
          seen.set(slug, sectionKey);
          locationBySlug.set(slug, { sectionKey, index: i });
        }
      }

      return { sectionSlugsByKey, locationBySlug };
    })();
  }

  return navIndexPromise;
}

const getNavIndex = cache(getNavIndexUncached);

async function getPrevNextSlugsFromConfig(slug: string): Promise<{
  previousSlug?: string;
  nextSlug?: string;
}> {
  const navIndex = await getNavIndex();
  const location = navIndex.locationBySlug.get(slug);
  if (!location) return {};

  const sectionSlugs =
    navIndex.sectionSlugsByKey.get(location.sectionKey) ?? [];
  const previousSlug =
    location.index > 0 ? sectionSlugs[location.index - 1] : undefined;
  const nextSlug =
    location.index < sectionSlugs.length - 1
      ? sectionSlugs[location.index + 1]
      : undefined;

  return { previousSlug, nextSlug };
}

function normalizeSlugRef(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  const withoutLeadingSlash = trimmed.replace(/^\/+/, "");
  const withoutTrailingSlash = withoutLeadingSlash.replace(/\/+$/, "");
  if (!withoutTrailingSlash) return null;
  // Must be a single route segment slug
  assertValidSlugParts([withoutTrailingSlash]);
  return withoutTrailingSlash;
}

export type ContentMeta = {
  slug: string;
  title: string;
  profileSrc?: string;
};

async function getOverviewMarkdownUncached(): Promise<string> {
  const absolutePath = path.join(ROOT_CONTENT_DIR, "overview.md");
  const raw = await fs.readFile(absolutePath, "utf8");
  const parsed = matter(raw);
  return parsed.content.trimStart();
}

export const getOverviewMarkdown = cache(getOverviewMarkdownUncached);

async function getContentMetaBySlugUncached(
  slug: string
): Promise<ContentMeta> {
  const normalized = normalizeSlugRef(slug);
  if (!normalized) {
    const err = new Error("Not found");
    (err as NodeJS.ErrnoException).code = "ENOENT";
    throw err;
  }

  const index = await getRootIndex();
  const hit = index.bySlug.get(normalized);
  if (!hit) {
    const err = new Error("Not found");
    (err as NodeJS.ErrnoException).code = "ENOENT";
    throw err;
  }

  const raw = await fs.readFile(hit.absolutePath, "utf8");
  const parsed = matter(raw);

  const frontmatterTitle = parsed.data?.title;
  const frontmatterProfileSrc = parsed.data?.profileSrc;
  const title =
    (typeof frontmatterTitle === "string" && frontmatterTitle.trim()) ||
    getTitleFromMarkdownContent(parsed.content) ||
    humanizeSlug(normalized);

  const profileSrc =
    typeof frontmatterProfileSrc === "string" && frontmatterProfileSrc.trim()
      ? frontmatterProfileSrc.trim()
      : undefined;

  return { slug: normalized, title: title.trim(), profileSrc };
}

export const getContentMetaBySlug = cache(getContentMetaBySlugUncached);

function assertValidSlugParts(slugParts: string[]) {
  for (const part of slugParts) {
    // Disallow traversal, path separators, empty segments
    if (!part || part === "." || part === "..") {
      throw new Error(`Invalid route segment "${part}"`);
    }
    if (part.includes("/") || part.includes("\\")) {
      throw new Error(`Invalid route segment "${part}"`);
    }
  }
}

type RootIndex = {
  bySlug: Map<string, { absolutePath: string; fileRelativePath: string }>;
  slugs: string[];
};

let rootIndexPromise: Promise<RootIndex> | null = null;

async function listMarkdownFilesRecursively(
  dirAbsolutePath: string
): Promise<string[]> {
  const entries = await fs.readdir(dirAbsolutePath, { withFileTypes: true });
  const out: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(dirAbsolutePath, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await listMarkdownFilesRecursively(absolutePath)));
      continue;
    }
    if (!entry.isFile()) continue;
    if (entry.name.toLowerCase().endsWith(".md")) out.push(absolutePath);
  }

  return out;
}

function slugifyFilename(filename: string) {
  // Requirement: URLs point to the filename (without extension).
  // We keep it as-is (no case folding / transformations) so file names map directly to URLs.
  return filename;
}

async function getRootIndexUncached(): Promise<RootIndex> {
  if (!rootIndexPromise) {
    rootIndexPromise = (async () => {
      const absolutePaths = await listMarkdownFilesRecursively(
        ROOT_CONTENT_DIR
      );
      const bySlug = new Map<
        string,
        { absolutePath: string; fileRelativePath: string }
      >();
      const duplicates = new Map<string, string[]>();

      for (const absolutePath of absolutePaths) {
        const filename = path.parse(absolutePath).name;
        const slug = slugifyFilename(filename);
        const fileRelativePath = path
          .relative(process.cwd(), absolutePath)
          .split(path.sep)
          .join("/");

        const existing = bySlug.get(slug);
        if (existing) {
          duplicates.set(slug, [existing.fileRelativePath, fileRelativePath]);
          continue;
        }

        bySlug.set(slug, { absolutePath, fileRelativePath });
      }

      if (duplicates.size > 0) {
        const msg = [...duplicates.entries()]
          .map(([slug, paths]) => `- "${slug}": ${paths.join(" , ")}`)
          .join("\n");
        throw new Error(
          `Duplicate markdown filenames found under "root/". Filenames must be unique if they map to the same URL slug.\n${msg}`
        );
      }

      const slugs = [...bySlug.keys()].sort((a, b) => a.localeCompare(b));
      return { bySlug, slugs };
    })();
  }

  return rootIndexPromise;
}

const getRootIndex = cache(getRootIndexUncached);

function humanizeSlug(slug: string) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getTitleFromMarkdownContent(markdown: string) {
  // First H1-ish line: "# Title"
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    const m = /^#\s+(.+?)\s*$/.exec(line);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

async function getContentPageBySlugUncached(
  slugParts: string[]
): Promise<ContentPage> {
  assertValidSlugParts(slugParts);

  // New rule: everything under root/ is addressable by the filename (without extension).
  // Example: /personal-token -> root/stories/personal-token.md
  if (slugParts.length !== 1) {
    const err = new Error("Not found");
    (err as NodeJS.ErrnoException).code = "ENOENT";
    throw err;
  }

  const slug = slugParts[0];
  const index = await getRootIndex();
  const hit = index.bySlug.get(slug);
  if (!hit) {
    const err = new Error("Not found");
    (err as NodeJS.ErrnoException).code = "ENOENT";
    throw err;
  }

  const raw = await fs.readFile(hit.absolutePath, "utf8");
  const parsed = matter(raw);

  const frontmatterTitle = parsed.data?.title;
  const frontmatterCaption = parsed.data?.caption;
  const frontmatterVideo = parsed.data?.video;
  const frontmatterProfileSrc = parsed.data?.profileSrc;
  const frontmatterToc = parsed.data?.toc;
  const title =
    (typeof frontmatterTitle === "string" && frontmatterTitle.trim()) ||
    getTitleFromMarkdownContent(parsed.content) ||
    humanizeSlug(slug);
  const caption =
    typeof frontmatterCaption === "string" && frontmatterCaption.trim()
      ? frontmatterCaption.trim()
      : undefined;
  const video =
    typeof frontmatterVideo === "string" && frontmatterVideo.trim()
      ? frontmatterVideo.trim()
      : undefined;
  const profileSrc =
    typeof frontmatterProfileSrc === "string" && frontmatterProfileSrc.trim()
      ? frontmatterProfileSrc.trim()
      : undefined;
  const toc = frontmatterToc === true ? true : undefined;
  const { previousSlug, nextSlug } = await getPrevNextSlugsFromConfig(slug);

  return {
    title: title.trim(),
    caption,
    video,
    profileSrc,
    toc,
    previousSlug,
    nextSlug,
    markdown: parsed.content.trimStart(),
    fileRelativePath: hit.fileRelativePath,
  };
}

export const getContentPageBySlug = cache(getContentPageBySlugUncached);

export async function getAllContentSlugs(): Promise<string[]> {
  const index = await getRootIndex();
  return index.slugs;
}
