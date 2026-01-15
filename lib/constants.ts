export const REPO_URL = "https://github.com/OWNER/REPO";
export const REPO_BRANCH = "main";

/**
 * Canonical site URL used for absolute metadata URLs (Open Graph, Twitter, canonical, etc.)
 *
 * Configure in production with:
 * - NEXT_PUBLIC_SITE_URL (recommended): e.g. "https://onroot.net"
 * - or VERCEL_URL (auto): e.g. "my-app.vercel.app" (we'll prefix https://)
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
  "http://localhost:3000";
