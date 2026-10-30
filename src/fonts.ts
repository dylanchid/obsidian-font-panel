import type { FontEntry } from "./types";

/** Web-safe / commonly available fallbacks */
export const WEB_SAFE_FONTS: FontEntry[] = [
  { family: "system-ui", category: "sans", source: "web-safe" },
  { family: "ui-sans-serif", category: "sans", source: "web-safe" },
  { family: "ui-serif", category: "serif", source: "web-safe" },
  { family: "ui-monospace", category: "mono", source: "web-safe" },
  { family: "Arial", category: "sans", source: "web-safe" },
  { family: "Helvetica", category: "sans", source: "web-safe" },
  { family: "Verdana", category: "sans", source: "web-safe" },
  { family: "Tahoma", category: "sans", source: "web-safe" },
  { family: "Trebuchet MS", category: "sans", source: "web-safe" },
  { family: "Georgia", category: "serif", source: "web-safe" },
  { family: "Times New Roman", category: "serif", source: "web-safe" },
  { family: "Palatino Linotype", category: "serif", source: "web-safe" },
  { family: "Courier New", category: "mono", source: "web-safe" },
  { family: "Menlo", category: "mono", source: "web-safe" },
  { family: "Monaco", category: "mono", source: "web-safe" },
  { family: "Consolas", category: "mono", source: "web-safe" },
  { family: "Impact", category: "display", source: "web-safe" },
  { family: "Comic Sans MS", category: "display", source: "web-safe" },
];

/**
 * Curated Google Fonts — good for reading, UI, and editorial work.
 * Loaded on demand when previewed or applied.
 */
export const GOOGLE_FONTS: FontEntry[] = [
  // Sans
  { family: "Inter", category: "sans", source: "google" },
  { family: "Roboto", category: "sans", source: "google" },
  { family: "Open Sans", category: "sans", source: "google" },
  { family: "Lato", category: "sans", source: "google" },
  { family: "Montserrat", category: "sans", source: "google" },
  { family: "Source Sans 3", category: "sans", source: "google", googleFamily: "Source+Sans+3" },
  { family: "Nunito", category: "sans", source: "google" },
  { family: "Nunito Sans", category: "sans", source: "google" },
  { family: "Poppins", category: "sans", source: "google" },
  { family: "Raleway", category: "sans", source: "google" },
  { family: "Work Sans", category: "sans", source: "google" },
  { family: "DM Sans", category: "sans", source: "google" },
  { family: "Manrope", category: "sans", source: "google" },
  { family: "Outfit", category: "sans", source: "google" },
  { family: "Plus Jakarta Sans", category: "sans", source: "google" },
  { family: "Figtree", category: "sans", source: "google" },
  { family: "Karla", category: "sans", source: "google" },
  { family: "Mulish", category: "sans", source: "google" },
  { family: "Noto Sans", category: "sans", source: "google" },
  { family: "IBM Plex Sans", category: "sans", source: "google" },
  { family: "Space Grotesk", category: "sans", source: "google" },
  { family: "Sora", category: "sans", source: "google" },
  { family: "Lexend", category: "sans", source: "google" },
  { family: "Atkinson Hyperlegible", category: "sans", source: "google" },
  { family: "Public Sans", category: "sans", source: "google" },
  { family: "Schibsted Grotesk", category: "sans", source: "google" },
  { family: "Geist", category: "sans", source: "google" },
  { family: "Instrument Sans", category: "sans", source: "google" },
  { family: "Albert Sans", category: "sans", source: "google" },
  { family: "Red Hat Text", category: "sans", source: "google" },

  // Serif
  { family: "Merriweather", category: "serif", source: "google" },
  { family: "Lora", category: "serif", source: "google" },
  { family: "Playfair Display", category: "serif", source: "google" },
  { family: "Source Serif 4", category: "serif", source: "google", googleFamily: "Source+Serif+4" },
  { family: "Libre Baskerville", category: "serif", source: "google" },
  { family: "EB Garamond", category: "serif", source: "google" },
  { family: "Cormorant Garamond", category: "serif", source: "google" },
  { family: "Crimson Pro", category: "serif", source: "google" },
  { family: "Crimson Text", category: "serif", source: "google" },
  { family: "Spectral", category: "serif", source: "google" },
  { family: "Literata", category: "serif", source: "google" },
  { family: "Newsreader", category: "serif", source: "google" },
  { family: "Fraunces", category: "serif", source: "google" },
  { family: "IBM Plex Serif", category: "serif", source: "google" },
  { family: "Noto Serif", category: "serif", source: "google" },
  { family: "Bitter", category: "serif", source: "google" },
  { family: "PT Serif", category: "serif", source: "google" },
  { family: "Cardo", category: "serif", source: "google" },
  { family: "Alegreya", category: "serif", source: "google" },
  { family: "Libre Caslon Text", category: "serif", source: "google" },
  { family: "Instrument Serif", category: "serif", source: "google" },
  { family: "DM Serif Display", category: "serif", source: "google" },
  { family: "DM Serif Text", category: "serif", source: "google" },

  // Mono
  { family: "JetBrains Mono", category: "mono", source: "google" },
  { family: "Fira Code", category: "mono", source: "google" },
  { family: "Source Code Pro", category: "mono", source: "google" },
  { family: "IBM Plex Mono", category: "mono", source: "google" },
  { family: "Roboto Mono", category: "mono", source: "google" },
  { family: "Space Mono", category: "mono", source: "google" },
  { family: "Inconsolata", category: "mono", source: "google" },
  { family: "DM Mono", category: "mono", source: "google" },
  { family: "Ubuntu Mono", category: "mono", source: "google" },
  { family: "Cousine", category: "mono", source: "google" },
  { family: "Red Hat Mono", category: "mono", source: "google" },
  { family: "Geist Mono", category: "mono", source: "google" },
  { family: "Azeret Mono", category: "mono", source: "google" },
  { family: "Fragment Mono", category: "mono", source: "google" },

  // Display
  { family: "Bebas Neue", category: "display", source: "google" },
  { family: "Oswald", category: "display", source: "google" },
  { family: "Righteous", category: "display", source: "google" },
  { family: "Archivo Black", category: "display", source: "google" },
  { family: "Abril Fatface", category: "display", source: "google" },
  { family: "Cinzel", category: "display", source: "google" },
  { family: "Comfortaa", category: "display", source: "google" },
  { family: "Pacifico", category: "display", source: "google" },
  { family: "Lobster", category: "display", source: "google" },
  { family: "Josefin Sans", category: "display", source: "google" },
  { family: "Quicksand", category: "display", source: "google" },
  { family: "Bangers", category: "display", source: "google" },
];

const loadedGoogleFonts = new Set<string>();

export function googleCssFamily(entry: FontEntry): string {
  if (entry.googleFamily) return entry.googleFamily;
  return entry.family.replace(/ /g, "+");
}

/** Load a Google Font stylesheet once (weights useful for UI + body). */
export function ensureGoogleFontLoaded(entry: FontEntry): void {
  if (entry.source !== "google") return;
  const key = entry.family;
  if (loadedGoogleFonts.has(key)) return;
  loadedGoogleFonts.add(key);

  const family = googleCssFamily(entry);
  const href = `https://fonts.googleapis.com/css2?family=${family}:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap`;
  const id = `fp-google-${family.replace(/[^a-zA-Z0-9]+/g, "-")}`;
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

export function findFontEntry(
  family: string,
  catalog: FontEntry[]
): FontEntry | undefined {
  const lower = family.toLowerCase();
  return catalog.find((f) => f.family.toLowerCase() === lower);
}

/** Quote font-family for CSS when needed. */
export function cssFontFamily(family: string): string {
  if (!family) return "inherit";
  if (family.includes(" ") || family.includes("-")) {
    // system-ui and ui-* don't need quotes; multi-word names do
    if (/^(system-ui|ui-sans-serif|ui-serif|ui-monospace|sans-serif|serif|monospace)$/.test(family)) {
      return family;
    }
    return `"${family.replace(/"/g, '\\"')}"`;
  }
  return family;
}

interface LocalFontData {
  family: string;
  fullName?: string;
  postscriptName?: string;
  style?: string;
}

declare global {
  interface Window {
    queryLocalFonts?: () => Promise<LocalFontData[]>;
  }
}

/**
 * Enumerate system fonts when the Local Font Access API is available
 * (Chromium / recent Electron). Falls back to empty list.
 */
const SYSTEM_FONT_SKIP =
  /dingbat|webdings|wingdings|emoji|symbol|braille|ornament|notocoloremoji|apple color emoji|stix two math|lastresort|marlett|ms outlook|bookshelf symbol/i;

export async function loadSystemFonts(): Promise<FontEntry[]> {
  if (typeof window.queryLocalFonts !== "function") {
    return [];
  }
  try {
    const fonts = await window.queryLocalFonts();
    const seen = new Set<string>();
    const entries: FontEntry[] = [];
    for (const f of fonts) {
      const family = f.family?.trim();
      if (!family || seen.has(family.toLowerCase())) continue;
      if (SYSTEM_FONT_SKIP.test(family)) continue;
      seen.add(family.toLowerCase());
      const category = guessCategory(family);
      entries.push({ family, category, source: "system" });
    }
    entries.sort((a, b) => a.family.localeCompare(b.family));
    return entries;
  } catch {
    // Permission denied or unsupported
    return [];
  }
}

function guessCategory(family: string): FontEntry["category"] {
  const n = family.toLowerCase();
  if (
    /mono|console|courier|code|fixed|typewriter|hack|menlo|monaco|consolas|inconsolata|fira code|jetbrains/.test(
      n
    )
  ) {
    return "mono";
  }
  if (
    /serif|garamond|baskerville|georgia|times|palatino|minion|caslon|didot|bodoni|playfair|merriweather|literata|crimson|eb garamond/.test(
      n
    ) &&
    !/sans/.test(n)
  ) {
    return "serif";
  }
  if (
    /display|script|hand|brush|blackletter|decorative|stencil|comic|impact|bebas|lobster|pacifico|bangers/.test(
      n
    )
  ) {
    return "display";
  }
  return "sans";
}

export function buildCatalog(systemFonts: FontEntry[]): FontEntry[] {
  const map = new Map<string, FontEntry>();

  for (const f of WEB_SAFE_FONTS) {
    map.set(f.family.toLowerCase(), f);
  }
  for (const f of GOOGLE_FONTS) {
    map.set(f.family.toLowerCase(), f);
  }
  // System fonts fill gaps; don't overwrite curated metadata
  for (const f of systemFonts) {
    const key = f.family.toLowerCase();
    if (!map.has(key)) {
      map.set(key, f);
    } else {
      // Mark existing as also present on system when names match
      const existing = map.get(key)!;
      if (existing.source === "web-safe") {
        map.set(key, { ...existing, source: "system" });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.family.localeCompare(b.family)
  );
}
