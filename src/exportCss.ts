import { HEADING_LEVELS, type FontEntry, type NoteTypography } from "./types";
import { cssFontFamily, ensureGoogleFontLoaded, findFontEntry } from "./fonts";

/** Compile every surface from the same small set of note decisions. */
export function buildTypographyCss(
  settings: NoteTypography,
  catalog: FontEntry[],
  scopeSelector: string
): string {
  for (const family of [
    settings.bodyFamily,
    settings.headingFamily,
    ...Object.values(settings.headingFamilies ?? {}),
  ]) {
    if (!family) continue;
    const entry = findFontEntry(family, catalog);
    if (entry) ensureGoogleFontLoaded(entry);
  }

  const scope = scopeSelector.trim();
  if (!scope) return "";
  const body = settings.bodyFamily ? cssFontFamily(settings.bodyFamily) : "";
  const heading = settings.headingFamily ? cssFontFamily(settings.headingFamily) : "";
  const lines: string[] = [];
  const root: string[] = [];

  // Undefined means theme inheritance. Never write a default into a note.
  if (body) root.push(`--fp-body-font: ${body}`);
  if (heading) root.push(`--fp-heading-font: ${heading}`);
  if (settings.bodySizePx) root.push(`--fp-body-size: ${settings.bodySizePx}px`);
  if (settings.bodyWeight) root.push(`--fp-body-weight: ${settings.bodyWeight}`);
  if (settings.lineHeight) {
    root.push(`--fp-line-height: ${settings.lineHeight}`);
    root.push(`--line-height-normal: ${settings.lineHeight}`);
  }
  if (root.length) lines.push(`${scope} { ${root.join("; ")}; }`);

  const bodyRules: string[] = [];
  if (body) bodyRules.push("font-family: var(--fp-body-font) !important");
  if (settings.bodySizePx) bodyRules.push("font-size: var(--fp-body-size) !important");
  if (settings.bodyWeight) bodyRules.push("font-weight: var(--fp-body-weight) !important");
  if (settings.lineHeight) bodyRules.push("line-height: var(--fp-line-height) !important");
  if (bodyRules.length) {
    lines.push(`${scope} :is(.markdown-source-view.mod-cm6 .cm-content, .markdown-preview-view, .markdown-rendered) { ${bodyRules.join("; ")}; }`);
  }
  if (heading) {
    lines.push(`${scope} :is(.markdown-source-view.mod-cm6 .HyperMD-header, .markdown-preview-view :is(h1,h2,h3,h4,h5,h6), .markdown-rendered :is(h1,h2,h3,h4,h5,h6)) { font-family: var(--fp-heading-font) !important; }`);
  }
  for (const level of HEADING_LEVELS) {
    const family = settings.headingFamilies?.[level];
    const size = settings.headingSizesEm?.[level];
    const weight = settings.headingWeights?.[level];
    const lineHeight = settings.headingLineHeights?.[level];
    if (!family && !size && !weight && !lineHeight) continue;
    const rules: string[] = [];
    if (family) rules.push(`font-family: ${cssFontFamily(family)} !important`);
    if (size) rules.push(`font-size: ${size}em !important`);
    if (weight) rules.push(`font-weight: ${weight} !important`);
    if (lineHeight) rules.push(`line-height: ${lineHeight} !important`);
    lines.push(`${scope} :is(.markdown-source-view.mod-cm6 .HyperMD-header-${level}, .markdown-preview-view h${level}, .markdown-rendered h${level}) { ${rules.join("; ")}; }`);
  }
  return lines.join("\n");
}
