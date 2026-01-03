function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function getQueryParam(url: URL, key: string): string | null {
  const value = url.searchParams.get(key);
  return isNonEmptyString(value) ? value : null;
}

export function getYouTubeVideoId(inputUrl: string): string | null {
  if (!isNonEmptyString(inputUrl)) return null;

  let url: URL;
  try {
    url = new URL(inputUrl);
  } catch {
    return null;
  }

  const hostname = url.hostname.replace(/^www\./, "").toLowerCase();

  // youtu.be/<id>
  if (hostname === "youtu.be") {
    const id = url.pathname.replace(/^\//, "").split("/")[0];
    return isNonEmptyString(id) ? id : null;
  }

  if (hostname !== "youtube.com" && hostname !== "m.youtube.com") return null;

  // youtube.com/watch?v=<id>
  if (url.pathname === "/watch") {
    return getQueryParam(url, "v");
  }

  // youtube.com/embed/<id>
  if (url.pathname.startsWith("/embed/")) {
    const id = url.pathname.replace("/embed/", "").split("/")[0];
    return isNonEmptyString(id) ? id : null;
  }

  // youtube.com/shorts/<id>
  if (url.pathname.startsWith("/shorts/")) {
    const id = url.pathname.replace("/shorts/", "").split("/")[0];
    return isNonEmptyString(id) ? id : null;
  }

  return null;
}

export function getYouTubeEmbedUrl(inputUrl: string): string | null {
  const id = getYouTubeVideoId(inputUrl);
  if (!id) return null;
  return `https://www.youtube.com/embed/${encodeURIComponent(id)}`;
}


