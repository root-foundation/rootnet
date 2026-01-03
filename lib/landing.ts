import landingConfigJson from "./landing.config.json";

export type LandingLink = {
  slug: string;
  titleOverride?: string;
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
  heroTitleLines: string[];
  heroCaptionLines?: string[];
  sections: LandingSection[];
};

/**
 * Landing page configuration.
 *
 * - Ordering is respected exactly as written in `lib/landing.config.json`.
 * - For any link, `slug` must match a markdown filename under `root/` (without extension).
 *   Example: `root/stories/personal-token.md` -> slug: "personal-token" -> URL: "/personal-token"
 */
export const LANDING_CONFIG: LandingConfig = landingConfigJson as LandingConfig;
