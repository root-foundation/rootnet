import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

import { LANDING_CONFIG } from "@/lib/landing";

const ROOT_DIR = path.join(process.cwd(), "root");
const PROMPT_DIR = path.join(ROOT_DIR, "prompt");

type RootIndex = Map<string, { absolutePath: string; fileRelativePath: string }>;

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

async function getRootIndex(): Promise<RootIndex> {
  const absolutePaths = await listMarkdownFilesRecursively(ROOT_DIR);
  const bySlug: RootIndex = new Map();
  const duplicates = new Map<string, string[]>();

  for (const absolutePath of absolutePaths) {
    const filename = path.parse(absolutePath).name;
    const slug = filename; // filename (no extension) is the slug
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
      `Duplicate markdown filenames found under "root/". Filenames must be unique if they map to the same slug.\n${msg}`
    );
  }

  return bySlug;
}

function humanizeSlug(slug: string) {
  return slug
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getOrderedSlugsFromLandingConfig(): string[] {
  const slugs: string[] = [];

  for (const section of LANDING_CONFIG.sections) {
    if (section.kind === "story") {
      for (const group of section.groups) {
        for (const link of group) slugs.push(link.slug);
      }
      continue;
    }

    for (const link of section.links) slugs.push(link.slug);
  }

  // Enforce uniqueness (navigation assumes it, and prompt output should be deterministic).
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const s of slugs) {
    if (seen.has(s)) dupes.add(s);
    seen.add(s);
  }
  if (dupes.size > 0) {
    throw new Error(
      `Duplicate slug(s) found in landing config ordering: ${[...dupes].join(
        ", "
      )}`
    );
  }

  return slugs;
}

async function readTextFileOrEmpty(absolutePath: string): Promise<string> {
  try {
    return await fs.readFile(absolutePath, "utf8");
  } catch {
    return "";
  }
}

export async function buildProjectPromptText(): Promise<string> {
  const rootIndex = await getRootIndex();
  const orderedSlugs = getOrderedSlugsFromLandingConfig().filter((s) =>
    rootIndex.has(s)
  );

  const userInstructions = await readTextFileOrEmpty(
    path.join(PROMPT_DIR, "USER_INSTRUCTIONS.txt")
  );
  const aiPrompt = await readTextFileOrEmpty(
    path.join(PROMPT_DIR, "AI_PROMPT.txt")
  );

  const parts: string[] = [];

  parts.push("USER INSTRUCTIONS:\n");
  parts.push(userInstructions.trimEnd() + "\n\n");

  parts.push("AI PROMPT:\n");
  parts.push(aiPrompt.trimEnd() + "\n\n");

  parts.push("==============\nROOTNET START\n==============\n\n");

  for (const slug of orderedSlugs) {
    const hit = rootIndex.get(slug);
    if (!hit) continue;

    const raw = await fs.readFile(hit.absolutePath, "utf8");
    const parsed = matter(raw);

    const frontmatterTitle = parsed.data?.title;
    const title =
      typeof frontmatterTitle === "string" && frontmatterTitle.trim()
        ? frontmatterTitle.trim()
        : humanizeSlug(slug);

    // Turn title into an H1; keep the rest of the markdown as-is (minus frontmatter).
    parts.push(`# ${title}\n\n`);
    parts.push(parsed.content);
    if (!parsed.content.endsWith("\n")) parts.push("\n");
    parts.push("\n");
  }

  parts.push("==============\nROOTNET END\n==============\n");

  return parts.join("");
}


