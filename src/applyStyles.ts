import type { FontEntry, NoteTypography } from "./types";
import { buildTypographyCss } from "./exportCss";

const STYLE_ID = "font-panel-styles";

export interface ScopedTypography {
  scopeSelector: string;
  settings: NoteTypography;
}

export function applyTypography(entries: ScopedTypography[], catalog: FontEntry[]): void {
  let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = STYLE_ID;
    document.head.appendChild(style);
  }
  style.textContent = entries
    .map((entry) => buildTypographyCss(entry.settings, catalog, entry.scopeSelector))
    .filter(Boolean)
    .join("\n\n");
}

export function removeStyleEl(): void {
  document.getElementById(STYLE_ID)?.remove();
}
