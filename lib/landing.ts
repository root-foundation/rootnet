import landingConfigJson from "../root/landing.config.json";

export type LandingLink = {
  slug: string;
  titleOverride?: string;
  /**
   * Optional absolute URL for external links.
   * If provided (e.g. "https://..."), the landing page will open it in a new tab.
   */
  href?: string;
};

export type LandingSection =
  | {
      kind: "list";
      title: string;
      links: LandingLink[];
    }
  | {
      kind: "story";
      title: string;
      groups: LandingLink[][];
    };

export type LandingConfig = {
  /**
   * Small, faded line(s) above the main headline.
   * Example: "rootnet is an exploration"
   */
  heroKickerLines?: string[];
  heroTitleLines: string[];
  heroCaptionLines?: string[];
  sections: LandingSection[];
};

/**
 * Landing page configuration.
 *
 * - Ordering is respected exactly as written in `root/landing.config.json`.
 * - For internal links, `slug` should match a markdown path under `root/` (without extension).
 *   Example: `root/personal-token/spec.md` -> slug: "personal-token/spec" -> URL: "/personal-token/spec"
 * - For external links, set `href` to an absolute URL; `slug` is still used for labeling/ordering.
 */
export const LANDING_CONFIG: LandingConfig = landingConfigJson as LandingConfig;
