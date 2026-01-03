import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { MarkdownArticle } from "@/app/_components/MarkdownArticle";
import { getAllContentSlugs, getContentMetaBySlug, getContentPageBySlug } from "@/lib/content";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateStaticParams() {
  const slugs = await getAllContentSlugs();
  return slugs.map((s) => ({ slug: [s] }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const page = await getContentPageBySlug(slug);
    return {
      title: page.title,
      description: page.caption || undefined,
    };
  } catch (err) {
    if (isErrnoException(err) && err.code === "ENOENT") {
      notFound();
    }
    throw err;
  }
}

export default async function ContentPageRoute({ params }: PageProps) {
  const { slug } = await params;

  let page: Awaited<ReturnType<typeof getContentPageBySlug>>;
  let previous: Awaited<ReturnType<typeof getContentMetaBySlug>> | null = null;
  let next: Awaited<ReturnType<typeof getContentMetaBySlug>> | null = null;

  try {
    page = await getContentPageBySlug(slug);
    previous = page.previousSlug
      ? await getContentMetaBySlug(page.previousSlug).catch(() => null)
      : null;
    next = page.nextSlug
      ? await getContentMetaBySlug(page.nextSlug).catch(() => null)
      : null;
  } catch (err) {
    if (isErrnoException(err) && err.code === "ENOENT") {
      notFound();
    }
    throw err;
  }

  return (
    <MarkdownArticle
      title={page.title}
      caption={page.caption}
      video={page.video}
      profileSrc={page.profileSrc}
      previous={previous}
      next={next}
      markdown={page.markdown}
    />
  );
}

function isErrnoException(err: unknown): err is NodeJS.ErrnoException {
  return typeof err === "object" && err !== null && "code" in err;
}
