export interface FontPairing {
  id: string;
  name: string;
  vibe: string;
  /** Short reason the pair works */
  why: string;
  heading: string;
  body: string;
  mono: string;
  /** serif-sans, sans-serif, mono, display-sans, etc. */
  style: "serif-sans" | "sans-serif" | "serif-serif" | "sans-sans" | "display" | "mono";
}

/**
 * Curated pairings — each sets heading + body + mono together.
 * Names are designed for scanning; "why" teaches a bit of type craft.
 */
export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: "playfair-source",
    name: "Playfair + Source Sans",
    vibe: "Editorial modern",
    why: "High-contrast display serif on a quiet humanist sans — classic magazine pairing.",
    heading: "Playfair Display",
    body: "Source Sans 3",
    mono: "Source Code Pro",
    style: "serif-sans",
  },
  {
    id: "fraunces-inter",
    name: "Fraunces + Inter",
    vibe: "Soft display",
    why: "Optical-size serif energy with the most neutral UI sans available.",
    heading: "Fraunces",
    body: "Inter",
    mono: "JetBrains Mono",
    style: "serif-sans",
  },
  {
    id: "literata-ibm",
    name: "Literata + IBM Plex",
    vibe: "Bookish tech",
    why: "Reading-optimized serif with a structured grotesque for code-adjacent notes.",
    heading: "Literata",
    body: "IBM Plex Sans",
    mono: "IBM Plex Mono",
    style: "serif-sans",
  },
  {
    id: "instrument-dm",
    name: "Instrument Serif + DM Sans",
    vibe: "Design studio",
    why: "Fashionable transitional serif against a geometric workhorse.",
    heading: "Instrument Serif",
    body: "DM Sans",
    mono: "DM Mono",
    style: "serif-sans",
  },
  {
    id: "lora-lato",
    name: "Lora + Lato",
    vibe: "Warm classic",
    why: "Calligraphic serif body is rare — Lato keeps UI bits tidy without clashing.",
    heading: "Lato",
    body: "Lora",
    mono: "Fira Code",
    style: "sans-serif",
  },
  {
    id: "ebgaramond-inter",
    name: "Garamond + Inter",
    vibe: "Scholarly",
    why: "Old-style text face for long reading; Inter for crisp modern chrome.",
    heading: "EB Garamond",
    body: "Inter",
    mono: "JetBrains Mono",
    style: "serif-sans",
  },
  {
    id: "space-inter",
    name: "Space Grotesk + Inter",
    vibe: "Product",
    why: "Slightly quirky geometric headings, dead-neutral body — startup docs energy.",
    heading: "Space Grotesk",
    body: "Inter",
    mono: "Space Mono",
    style: "sans-sans",
  },
  {
    id: "crimson-public",
    name: "Crimson + Public Sans",
    vibe: "Newsroom",
    why: "Text serif built for screens with a civic, highly legible sans.",
    heading: "Crimson Pro",
    body: "Public Sans",
    mono: "Red Hat Mono",
    style: "serif-sans",
  },
  {
    id: "merriweather-opensans",
    name: "Merriweather + Open Sans",
    vibe: "Web classic",
    why: "The internet’s most-used readable pair for a reason.",
    heading: "Merriweather",
    body: "Open Sans",
    mono: "Source Code Pro",
    style: "serif-sans",
  },
  {
    id: "cormorant-karla",
    name: "Cormorant + Karla",
    vibe: "Elegant light",
    why: "Airy display serif with a friendly neo-grotesque body.",
    heading: "Cormorant Garamond",
    body: "Karla",
    mono: "Inconsolata",
    style: "serif-sans",
  },
  {
    id: "atkinson-mono",
    name: "Atkinson + JetBrains",
    vibe: "Accessible",
    why: "Hyperlegible body for focus; mono that stays distinct in diffs.",
    heading: "Atkinson Hyperlegible",
    body: "Atkinson Hyperlegible",
    mono: "JetBrains Mono",
    style: "sans-sans",
  },
  {
    id: "jetbrains-stack",
    name: "All JetBrains Mono",
    vibe: "Monospace life",
    why: "Commit to the bit — one face, perfect alignment, zero decision fatigue.",
    heading: "JetBrains Mono",
    body: "JetBrains Mono",
    mono: "JetBrains Mono",
    style: "mono",
  },
  {
    id: "bebas-inter",
    name: "Bebas + Inter",
    vibe: "Poster",
    why: "Condensed display only on titles; body stays calm and readable.",
    heading: "Bebas Neue",
    body: "Inter",
    mono: "Roboto Mono",
    style: "display",
  },
  {
    id: "spectral-work",
    name: "Spectral + Work Sans",
    vibe: "Refined UI",
    why: "Contemporary text serif with a sturdy geometric sans for structure.",
    heading: "Spectral",
    body: "Work Sans",
    mono: "Fira Code",
    style: "serif-sans",
  },
  {
    id: "newsreader-figtree",
    name: "Newsreader + Figtree",
    vibe: "Modern paper",
    why: "Variable news text face with a soft geometric companion.",
    heading: "Newsreader",
    body: "Figtree",
    mono: "Azeret Mono",
    style: "serif-sans",
  },
];

export function pairingStyleLabel(style: FontPairing["style"]): string {
  switch (style) {
    case "serif-sans":
      return "Serif → Sans";
    case "sans-serif":
      return "Sans → Serif";
    case "serif-serif":
      return "Serif stack";
    case "sans-sans":
      return "Sans stack";
    case "display":
      return "Display";
    case "mono":
      return "Mono";
  }
}
