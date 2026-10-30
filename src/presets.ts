import type {
  FontPanelSettings,
  HeadingLevel,
  HeadingLevelSettings,
  RoleSettings,
} from "./types";
import {
  DEFAULT_ROLE_BODY,
  DEFAULT_ROLE_HEADING,
  DEFAULT_ROLE_MONO,
  defaultHeadings,
  HEADING_LEVELS,
} from "./types";

export interface TypographyPreset {
  id: string;
  name: string;
  description: string;
  tag: string;
  body: RoleSettings;
  heading: RoleSettings;
  mono: RoleSettings;
  headingMode: "shared" | "per-level";
  /** Optional per-level overrides (merged onto defaults) */
  headings?: Partial<Record<HeadingLevel, Partial<HeadingLevelSettings>>>;
}

function role(
  family: string,
  partial: Partial<RoleSettings> = {}
): RoleSettings {
  return {
    family,
    sizePx: partial.sizePx ?? DEFAULT_ROLE_BODY.sizePx,
    weight: partial.weight ?? 400,
    lineHeight: partial.lineHeight ?? 1.6,
    letterSpacingEm: partial.letterSpacingEm ?? 0,
  };
}

function head(
  family: string,
  partial: Partial<RoleSettings> = {}
): RoleSettings {
  return {
    family,
    sizePx: 0,
    weight: partial.weight ?? DEFAULT_ROLE_HEADING.weight,
    lineHeight: partial.lineHeight ?? DEFAULT_ROLE_HEADING.lineHeight,
    letterSpacingEm:
      partial.letterSpacingEm ?? DEFAULT_ROLE_HEADING.letterSpacingEm,
  };
}

function mono(
  family: string,
  partial: Partial<RoleSettings> = {}
): RoleSettings {
  return {
    family,
    sizePx: partial.sizePx ?? DEFAULT_ROLE_MONO.sizePx,
    weight: partial.weight ?? 400,
    lineHeight: partial.lineHeight ?? 1.5,
    letterSpacingEm: partial.letterSpacingEm ?? 0,
  };
}

export const TYPOGRAPHY_PRESETS: TypographyPreset[] = [
  {
    id: "editorial",
    name: "Editorial",
    tag: "Reading",
    description: "Literary serif body with a display heading — great for essays and long-form notes.",
    body: role("Lora", { sizePx: 17, lineHeight: 1.7 }),
    heading: head("Playfair Display", { weight: 700, letterSpacingEm: -0.02 }),
    mono: mono("DM Mono", { sizePx: 13.5 }),
    headingMode: "shared",
  },
  {
    id: "clean-modern",
    name: "Clean Modern",
    tag: "Default",
    description: "Neutral Inter stack — clear, product-y, and easy on the eyes all day.",
    body: role("Inter", { sizePx: 16, lineHeight: 1.6 }),
    heading: head("Inter", { weight: 600, letterSpacingEm: -0.02 }),
    mono: mono("JetBrains Mono", { sizePx: 13.5 }),
    headingMode: "shared",
  },
  {
    id: "code-notes",
    name: "Code Notes",
    tag: "Dev",
    description: "IBM Plex family throughout — tuned for technical writing and snippets.",
    body: role("IBM Plex Sans", { sizePx: 15.5, lineHeight: 1.65 }),
    heading: head("IBM Plex Sans", { weight: 600 }),
    mono: mono("IBM Plex Mono", { sizePx: 13.5, lineHeight: 1.45 }),
    headingMode: "shared",
  },
  {
    id: "academic",
    name: "Academic",
    tag: "Study",
    description: "Classic Garamond text with restrained headings for papers and research.",
    body: role("EB Garamond", { sizePx: 18, lineHeight: 1.75 }),
    heading: head("EB Garamond", { weight: 600, letterSpacingEm: 0 }),
    mono: mono("Source Code Pro", { sizePx: 13 }),
    headingMode: "shared",
  },
  {
    id: "magazine",
    name: "Magazine",
    tag: "Display",
    description: "Dramatic H1, calmer subheads, readable serif body — hierarchy that pops.",
    body: role("Source Serif 4", { sizePx: 17, lineHeight: 1.7 }),
    heading: head("Fraunces", { weight: 700 }),
    mono: mono("JetBrains Mono", { sizePx: 13 }),
    headingMode: "per-level",
    headings: {
      1: { family: "Fraunces", weight: 700, sizeEm: 2.4, letterSpacingEm: -0.03 },
      2: { family: "Source Serif 4", weight: 600, sizeEm: 1.65 },
      3: { family: "Source Serif 4", weight: 600, sizeEm: 1.35 },
      4: { family: "Source Serif 4", weight: 600, sizeEm: 1.15 },
      5: { family: "Source Serif 4", weight: 500, sizeEm: 1.0 },
      6: { family: "Source Serif 4", weight: 500, sizeEm: 0.9 },
    },
  },
  {
    id: "swiss",
    name: "Swiss",
    tag: "UI",
    description: "Tight sans hierarchy inspired by international typographic style.",
    body: role("Inter", { sizePx: 15, lineHeight: 1.55, letterSpacingEm: 0 }),
    heading: head("Space Grotesk", { weight: 600, letterSpacingEm: -0.03 }),
    mono: mono("Space Mono", { sizePx: 13 }),
    headingMode: "per-level",
    headings: {
      1: { family: "Space Grotesk", weight: 700, sizeEm: 2.1, letterSpacingEm: -0.04 },
      2: { family: "Space Grotesk", weight: 600, sizeEm: 1.5 },
      3: { family: "Inter", weight: 600, sizeEm: 1.25 },
      4: { family: "Inter", weight: 600, sizeEm: 1.1 },
      5: { family: "Inter", weight: 500, sizeEm: 1.0 },
      6: { family: "Inter", weight: 500, sizeEm: 0.9 },
    },
  },
  {
    id: "friendly",
    name: "Friendly",
    tag: "Soft",
    description: "Rounded geometric sans — approachable notes, journals, personal writing.",
    body: role("Nunito", { sizePx: 16.5, lineHeight: 1.65 }),
    heading: head("Nunito", { weight: 700 }),
    mono: mono("Fira Code", { sizePx: 13.5 }),
    headingMode: "shared",
  },
  {
    id: "humanist",
    name: "Humanist",
    tag: "Warm",
    description: "Warm serif display with a soft sans body — personal essays and letters.",
    body: role("Source Sans 3", { sizePx: 16.5, lineHeight: 1.65 }),
    heading: head("Literata", { weight: 700, letterSpacingEm: -0.015 }),
    mono: mono("Inconsolata", { sizePx: 14 }),
    headingMode: "shared",
  },
  {
    id: "terminal",
    name: "Terminal",
    tag: "Mono",
    description: "Everything monospaced — for people who live in the terminal.",
    body: role("JetBrains Mono", { sizePx: 14.5, lineHeight: 1.55 }),
    heading: head("JetBrains Mono", { weight: 700, letterSpacingEm: 0 }),
    mono: mono("JetBrains Mono", { sizePx: 13.5 }),
    headingMode: "shared",
  },
  {
    id: "atelier",
    name: "Atelier",
    tag: "Craft",
    description: "Instrument Serif titles with clean sans body — design-forward notes.",
    body: role("DM Sans", { sizePx: 16, lineHeight: 1.65 }),
    heading: head("Instrument Serif", { weight: 400, letterSpacingEm: -0.01 }),
    mono: mono("DM Mono", { sizePx: 13 }),
    headingMode: "per-level",
    headings: {
      1: { family: "Instrument Serif", weight: 400, sizeEm: 2.35 },
      2: { family: "Instrument Serif", weight: 400, sizeEm: 1.7 },
      3: { family: "DM Sans", weight: 600, sizeEm: 1.3 },
      4: { family: "DM Sans", weight: 600, sizeEm: 1.15 },
      5: { family: "DM Sans", weight: 500, sizeEm: 1.0 },
      6: { family: "DM Sans", weight: 500, sizeEm: 0.9 },
    },
  },
];

/** Apply a preset onto settings (mutates a clone you pass in or returns patch fields). */
export function applyPresetToSettings(
  settings: FontPanelSettings,
  preset: TypographyPreset
): void {
  settings.body = { ...preset.body };
  settings.heading = { ...preset.heading };
  settings.mono = { ...preset.mono };
  settings.headingMode = preset.headingMode;
  settings.headings = defaultHeadings();
  if (preset.headings) {
    for (const level of HEADING_LEVELS) {
      const partial = preset.headings[level];
      if (partial) {
        settings.headings[level] = {
          ...settings.headings[level],
          ...partial,
          family: partial.family ?? settings.headings[level].family,
        };
      }
    }
  } else if (preset.headingMode === "shared") {
    // Mirror shared heading font into levels for easier switch to per-level later
    for (const level of HEADING_LEVELS) {
      settings.headings[level].family = preset.heading.family;
      settings.headings[level].weight = preset.heading.weight;
      settings.headings[level].lineHeight = preset.heading.lineHeight;
      settings.headings[level].letterSpacingEm = preset.heading.letterSpacingEm;
    }
  }
  settings.lastPresetId = preset.id;
  settings.lastPairingId = "";
}
