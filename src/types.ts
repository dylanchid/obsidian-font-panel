export type FontRole = "body" | "heading" | "mono";
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
/** 0 = shared “All headings”; 1–6 = individual level when per-level is on */
export type ActiveHeadingTarget = 0 | HeadingLevel;
export type FontCategory =
  | "all"
  | "sans"
  | "serif"
  | "mono"
  | "display"
  | "system"
  | "favorites";
export type FontSource = "system" | "google" | "web-safe";
export type PanelMode =
  | "design"
  | "color"
  | "layout"
  | "presets"
  | "pairings"
  | "export";
export type HeadingMode = "shared" | "per-level";
export type DesignTarget = "note" | "interface";

/**
 * The only persisted design decisions for a note. Every field is optional on
 * purpose: undefined means "let the current Obsidian theme decide".
 */
export interface NoteTypography {
  bodyFamily?: string;
  headingFamily?: string;
  headingFamilies?: Partial<Record<HeadingLevel, string>>;
  bodySizePx?: number;
  bodyWeight?: number;
  headingSizesEm?: Partial<Record<HeadingLevel, number>>;
  headingWeights?: Partial<Record<HeadingLevel, number>>;
  headingLineHeights?: Partial<Record<HeadingLevel, number>>;
  lineHeight?: number;
}

export interface TypographyLoadout { id: string; name: string; typography: NoteTypography; }

export interface StudioUiState {
  activeRole: FontRole;
  activeHeadingLevel: HeadingLevel;
  target: "note" | "editor";
  fontQuery: string;
}

export interface StudioData {
  version: 6;
  ui: StudioUiState;
  editor: NoteTypography;
  files: Record<string, NoteTypography>;
  loadouts: TypographyLoadout[];
}

export const DEFAULT_NOTE_TYPOGRAPHY: NoteTypography = {};
/** A quiet editorial scale for everyday notes. Note overrides still inherit it. */
export const BASE_NOTE_PRESET: NoteTypography = {
  bodyFamily: "Inter",
  headingFamily: "Georgia",
  bodySizePx: 16,
  lineHeight: 1.65,
  headingSizesEm: { 1: 2, 2: 1.55, 3: 1.3, 4: 1.1, 5: 1, 6: 0.9 },
  headingWeights: { 2: 400 },
};
export const DEFAULT_STUDIO_UI: StudioUiState = {
  activeRole: "body",
  activeHeadingLevel: 1,
  target: "note",
  fontQuery: "",
};

export interface FontEntry {
  family: string;
  category: Exclude<FontCategory, "all" | "favorites">;
  source: FontSource;
  /** Google Fonts URL family param, if different from display name */
  googleFamily?: string;
}

export interface RoleSettings {
  family: string;
  sizePx: number;
  weight: number;
  lineHeight: number;
  letterSpacingEm: number;
}

/** Heading level size is in em relative to body; other fields match RoleSettings */
export interface HeadingLevelSettings extends RoleSettings {
  /** Relative size in em (e.g. 2.0 for H1) */
  sizeEm: number;
}

export interface FontPanelSettings {
  body: RoleSettings;
  /** Shared heading metrics/font when headingMode is "shared", and fallback */
  heading: RoleSettings;
  mono: RoleSettings;
  headingMode: HeadingMode;
  headings: Record<HeadingLevel, HeadingLevelSettings>;
  favorites: string[];
  previewText: string;
  activeRole: FontRole;
  activeHeadingLevel: ActiveHeadingTarget;
  filterCategory: FontCategory;
  searchQuery: string;
  panelMode: PanelMode;
  lastPresetId: string;
  lastPairingId: string;
  bodyColor: string;
  h1Color: string;
  h2Color: string;
  h3Color: string;
  paragraphSpacingEm: number;
  maxWidthPx: number;
  designTarget: DesignTarget;
}

export interface SystemDesignSettings {
  family: string;
  sizePx: number;
  textColor: string;
  accentColor: string;
  radiusPx: number;
}

/** Fields that affect the rendered note and therefore belong to one file. */
export type FileTypographySettings = Pick<
  FontPanelSettings,
  | "body"
  | "heading"
  | "mono"
  | "headingMode"
  | "headings"
  | "lastPresetId"
  | "lastPairingId"
  | "bodyColor"
  | "h1Color"
  | "h2Color"
  | "h3Color"
  | "paragraphSpacingEm"
  | "maxWidthPx"
>;

/** Panel preferences are global; they never affect another note's rendering. */
export type FontPanelUiSettings = Omit<
  FontPanelSettings,
  keyof FileTypographySettings
>;

export interface FontPanelData {
  version: 3;
  ui: FontPanelUiSettings;
  system: SystemDesignSettings;
  files: Record<string, FileTypographySettings>;
}

export const HEADING_LEVELS: HeadingLevel[] = [1, 2, 3, 4, 5, 6];

export const DEFAULT_ROLE_BODY: RoleSettings = {
  family: "",
  sizePx: 16,
  weight: 400,
  lineHeight: 1.6,
  letterSpacingEm: 0,
};

export const DEFAULT_ROLE_HEADING: RoleSettings = {
  family: "",
  sizePx: 0,
  weight: 600,
  lineHeight: 1.25,
  letterSpacingEm: -0.01,
};

export const DEFAULT_ROLE_MONO: RoleSettings = {
  family: "",
  sizePx: 14,
  weight: 400,
  lineHeight: 1.5,
  letterSpacingEm: 0,
};

const DEFAULT_HEADING_EMS: Record<HeadingLevel, number> = {
  1: 2.0,
  2: 1.6,
  3: 1.3,
  4: 1.15,
  5: 1.0,
  6: 0.9,
};

export function defaultHeadingLevel(level: HeadingLevel): HeadingLevelSettings {
  return {
    family: "",
    sizePx: 0,
    sizeEm: DEFAULT_HEADING_EMS[level],
    weight: level <= 2 ? 700 : 600,
    lineHeight: level === 1 ? 1.2 : 1.25,
    letterSpacingEm: level <= 2 ? -0.02 : -0.01,
  };
}

export function defaultHeadings(): Record<HeadingLevel, HeadingLevelSettings> {
  return {
    1: defaultHeadingLevel(1),
    2: defaultHeadingLevel(2),
    3: defaultHeadingLevel(3),
    4: defaultHeadingLevel(4),
    5: defaultHeadingLevel(5),
    6: defaultHeadingLevel(6),
  };
}

export const DEFAULT_SETTINGS: FontPanelSettings = {
  body: { ...DEFAULT_ROLE_BODY },
  heading: { ...DEFAULT_ROLE_HEADING },
  mono: { ...DEFAULT_ROLE_MONO },
  headingMode: "shared",
  headings: defaultHeadings(),
  favorites: [],
  previewText: "The quick brown fox jumps over the lazy dog",
  activeRole: "body",
  activeHeadingLevel: 0,
  filterCategory: "all",
  searchQuery: "",
  panelMode: "design",
  lastPresetId: "",
  lastPairingId: "",
  bodyColor: "",
  h1Color: "",
  h2Color: "",
  h3Color: "",
  paragraphSpacingEm: 0,
  maxWidthPx: 0,
  designTarget: "note",
};

export const DEFAULT_SYSTEM_DESIGN: SystemDesignSettings = {
  family: "",
  sizePx: 0,
  textColor: "",
  accentColor: "",
  radiusPx: 0,
};

export const ROLE_LABELS: Record<FontRole, string> = {
  body: "Body",
  heading: "Headings",
  mono: "Mono",
};

export const PANEL_MODE_LABELS: Record<PanelMode, string> = {
  design: "Type",
  color: "Color",
  layout: "Layout",
  presets: "Presets",
  pairings: "Pairs",
  export: "Export",
};

export const CATEGORY_LABELS: Record<FontCategory, string> = {
  all: "All",
  sans: "Sans",
  serif: "Serif",
  mono: "Mono",
  display: "Display",
  system: "System",
  favorites: "★",
};

export function cloneRole(r: RoleSettings): RoleSettings {
  return { ...r };
}

export function cloneHeadingLevel(h: HeadingLevelSettings): HeadingLevelSettings {
  return { ...h };
}

export function cloneSettings(s: FontPanelSettings): FontPanelSettings {
  return {
    ...s,
    body: cloneRole(s.body),
    heading: cloneRole(s.heading),
    mono: cloneRole(s.mono),
    headings: {
      1: cloneHeadingLevel(s.headings[1]),
      2: cloneHeadingLevel(s.headings[2]),
      3: cloneHeadingLevel(s.headings[3]),
      4: cloneHeadingLevel(s.headings[4]),
      5: cloneHeadingLevel(s.headings[5]),
      6: cloneHeadingLevel(s.headings[6]),
    },
    favorites: [...s.favorites],
  };
}

export function fileTypographyFromSettings(
  settings: FontPanelSettings
): FileTypographySettings {
  const cloned = cloneSettings(settings);
  return {
    body: cloned.body,
    heading: cloned.heading,
    mono: cloned.mono,
    headingMode: cloned.headingMode,
    headings: cloned.headings,
    lastPresetId: cloned.lastPresetId,
    lastPairingId: cloned.lastPairingId,
    bodyColor: cloned.bodyColor,
    h1Color: cloned.h1Color,
    h2Color: cloned.h2Color,
    h3Color: cloned.h3Color,
    paragraphSpacingEm: cloned.paragraphSpacingEm,
    maxWidthPx: cloned.maxWidthPx,
  };
}

export function uiFromSettings(
  settings: FontPanelSettings
): FontPanelUiSettings {
  return {
    favorites: [...settings.favorites],
    previewText: settings.previewText,
    activeRole: settings.activeRole,
    activeHeadingLevel: settings.activeHeadingLevel,
    filterCategory: settings.filterCategory,
    searchQuery: settings.searchQuery,
    panelMode: settings.panelMode,
    designTarget: settings.designTarget,
  };
}

/** Resolve which family is active for a heading level */
export function resolveHeadingFamily(
  settings: FontPanelSettings,
  level: HeadingLevel
): string {
  if (settings.headingMode === "per-level") {
    const fam = settings.headings[level].family;
    if (fam) return fam;
  }
  return settings.heading.family || settings.body.family;
}

export function resolveHeadingMetrics(
  settings: FontPanelSettings,
  level: HeadingLevel
): HeadingLevelSettings {
  const base = settings.headings[level];
  if (settings.headingMode === "per-level") {
    return {
      ...base,
      family: base.family || settings.heading.family,
      weight: base.family || base.weight !== defaultHeadingLevel(level).weight
        ? base.weight
        : settings.heading.weight || base.weight,
      lineHeight: base.lineHeight,
      letterSpacingEm: base.letterSpacingEm,
    };
  }
  return {
    ...base,
    family: settings.heading.family,
    weight: settings.heading.weight,
    lineHeight: settings.heading.lineHeight,
    letterSpacingEm: settings.heading.letterSpacingEm,
  };
}
