import { ItemView, Modal, WorkspaceLeaf, setIcon } from "obsidian";
import type FontPanelPlugin from "./main";
import { HEADING_LEVELS, type FontRole, type HeadingLevel, type NoteTypography } from "./types";
import { buildTypographyCss } from "./exportCss";
import { cssFontFamily, ensureGoogleFontLoaded } from "./fonts";

export const VIEW_TYPE_FONT_PANEL = "font-panel";

export class FontPanelView extends ItemView {
  private static nextPreviewId = 1;
  private bodyEl: HTMLElement | null = null;
  private previewId = "";

  constructor(leaf: WorkspaceLeaf, private plugin: FontPanelPlugin) {
    super(leaf);
  }

  getViewType(): string { return VIEW_TYPE_FONT_PANEL; }
  getDisplayText(): string { return "Typography"; }
  getIcon(): string { return "type"; }

  async onOpen(): Promise<void> {
    this.bodyEl = this.containerEl.children[1] as HTMLElement;
    this.bodyEl.empty();
    this.bodyEl.addClass("font-panel", "font-panel-compact");
    this.refreshAll();
  }

  refreshAll(): void {
    if (!this.bodyEl) return;
    const scrollTop = this.bodyEl.scrollTop;
    const previewOpen = this.bodyEl.querySelector<HTMLDetailsElement>(".fp-preview-detail")?.open ?? true;
    const advancedOpen = this.bodyEl.querySelector<HTMLDetailsElement>(".fp-advanced-detail")?.open ?? false;
    this.bodyEl.empty();
    const path = this.plugin.getActiveFilePath();
    this.renderHeader(path);
    if (!path && this.plugin.ui.target === "note") return;
    const style = this.plugin.activeTypography;
    this.renderLoadouts();
    this.renderPreview(style);
    this.renderRoleControls(style);
    this.renderAdvanced(style);
    this.renderFooter();
    const previewDetail = this.bodyEl.querySelector<HTMLDetailsElement>(".fp-preview-detail");
    if (previewDetail) previewDetail.open = previewOpen;
    const advancedDetail = this.bodyEl.querySelector<HTMLDetailsElement>(".fp-advanced-detail");
    if (advancedDetail) advancedDetail.open = advancedOpen;
    this.bodyEl.scrollTop = scrollTop;
  }

  private renderHeader(path: string | null): void {
    const header = this.bodyEl!.createDiv({ cls: "fp-compact-header" });
    header.createDiv({ text: "Typography", cls: "fp-compact-title" });
    const target = header.createDiv({ cls: "fp-target-toggle" });
    for (const choice of ["note", "editor"] as const) {
      const button = target.createEl("button", {
        text: choice === "note" ? "This note" : "All notes",
        cls: this.plugin.ui.target === choice ? "is-active" : "",
        attr: { "aria-pressed": String(this.plugin.ui.target === choice) },
      });
      button.addEventListener("click", () => {
        this.plugin.ui.target = choice;
        this.plugin.saveUi();
        this.refreshAll();
        this.bodyEl?.querySelector<HTMLButtonElement>(`.fp-target-toggle button[aria-pressed="true"]`)?.focus();
      });
    }
    header.createDiv({
      text: this.plugin.ui.target === "editor"
        ? "All Markdown notes"
        : path ?? "Open a Markdown note to style it",
      cls: "fp-compact-path",
      attr: path ? { title: path } : {},
    });
    if (path || this.plugin.ui.target === "editor") {
      header.createSpan({
        text: this.plugin.hasSavedTypography() ? (this.plugin.ui.target === "editor" ? "All notes overrides" : "Note overrides") : "Theme default",
        cls: "fp-compact-state" + (this.plugin.hasSavedTypography() ? " is-custom" : ""),
      });
    }
  }

  private renderLoadouts(): void {
    const row = this.bodyEl!.createDiv({ cls: "fp-loadouts" });
    const picker = row.createEl("select", { attr: { "aria-label": "Saved loadout" } });
    picker.createEl("option", { text: "Choose loadout…", value: "" });
    for (const loadout of this.plugin.loadouts) picker.createEl("option", { text: loadout.name, value: loadout.id });
    const apply = row.createEl("button", { text: "Apply", attr: { "aria-label": `Apply loadout to ${this.plugin.ui.target === "note" ? "this note" : "all notes"}` } });
    apply.disabled = true;
    picker.addEventListener("change", () => { apply.disabled = !picker.value; });
    apply.addEventListener("click", () => this.plugin.applyLoadout(picker.value));
    row.createEl("button", { text: "Save as…" }).addEventListener("click", () => {
      const modal = new Modal(this.app);
      modal.contentEl.addClass("fp-loadout-modal");
      modal.titleEl.setText("Save typography loadout");
      const input = modal.contentEl.createEl("input", { type: "text", placeholder: "Loadout name", attr: { "aria-label": "Loadout name" } });
      const save = () => {
        if (!input.value.trim()) return;
        this.plugin.saveLoadout(input.value);
        modal.close();
      };
      input.addEventListener("keydown", (event) => { if (event.key === "Enter") save(); });
      modal.contentEl.createEl("button", { text: "Save", cls: "mod-cta" }).addEventListener("click", save);
      modal.open();
      input.focus();
    });
  }

  private renderPreview(style: NoteTypography): void {
    this.previewId = "fp-preview-" + FontPanelView.nextPreviewId++;
    const selector = '[data-font-panel-preview="' + this.previewId + '"]';
    const preview = this.bodyEl!.createEl("details", {
      cls: "fp-compact-preview fp-preview-detail",
      attr: { "data-font-panel-preview": this.previewId },
    });
    preview.open = true;
    preview.createEl("summary", { text: "Live preview" });
    preview.createEl("style", { text: buildTypographyCss(style, this.plugin.catalog, selector) });
    const sizer = preview.createDiv({ cls: "fp-preview-sizer markdown-rendered" });
    const level = this.plugin.ui.activeHeadingLevel;
    sizer.createEl(`h${level}`, { text: level === 1 ? "A note in focus" : `Heading ${level} in focus` });
    sizer.createEl("p", { text: "Good type makes a long note easier to read." });
  }

  private renderRoleControls(style: NoteTypography): void {
    const section = this.bodyEl!.createDiv({ cls: "fp-compact-section" });
    section.createDiv({ text: "Body", cls: "fp-compact-label" });
    const roles: Array<{ role: FontRole; label: string; key: keyof Pick<NoteTypography, "bodyFamily" | "headingFamily"> }> = [
      { role: "body", label: "Body", key: "bodyFamily" },
    ];
    for (const item of roles) this.renderFontControl(section, item.role, item.label, item.key, style);
    this.renderSlider(section, "Body size", style.bodySizePx ?? 16, 12, 28, 0.5, "px", !!this.plugin.activeOverrides.bodySizePx, (value) => this.plugin.updateActiveTypography((next) => { next.bodySizePx = value; }), () => this.plugin.updateActiveTypography((next) => { next.bodySizePx = undefined; }), this.source("bodySizePx"));
    this.renderSlider(section, "Body line height", style.lineHeight ?? 1.6, 1, 2.2, 0.05, "", !!this.plugin.activeOverrides.lineHeight, (value) => this.plugin.updateActiveTypography((next) => { next.lineHeight = value; }), () => this.plugin.updateActiveTypography((next) => { next.lineHeight = undefined; }), this.source("lineHeight"));
    this.renderWeight(section, "Body weight", style.bodyWeight, this.source("bodyWeight"), (weight) => this.plugin.updateActiveTypography((next) => { next.bodyWeight = weight; }));
  }

  private renderFontControl(
    section: HTMLElement,
    role: FontRole,
    label: string,
    key: keyof Pick<NoteTypography, "bodyFamily" | "headingFamily">,
    style: NoteTypography
  ): void {
    const row = section.createDiv({ cls: "fp-compact-row" });
    const labelEl = row.createEl("span", {
      text: label,
      cls: "fp-compact-role",
    });
    labelEl.id = `fp-${this.previewId}-${role}`;
    row.createSpan({ text: this.source(key), cls: "fp-source" });
    this.renderFontPicker(row, style[key] ?? "", (family) => {
      this.plugin.updateActiveTypography((next) => { next[key] = family || undefined; });
    }, labelEl.id);
    const clear = row.createEl("button", {
      cls: "fp-compact-clear",
      attr: { "aria-label": this.plugin.ui.target === "note" ? "Inherit editor " + label.toLowerCase() + " font" : "Use theme " + label.toLowerCase() + " font", title: "Reset " + label.toLowerCase() + " font" },
    });
    setIcon(clear, "rotate-ccw");
    clear.disabled = !this.plugin.activeOverrides[key];
    clear.addEventListener("click", () => this.plugin.updateActiveTypography((next) => { next[key] = undefined; }));
  }

  private renderAdvanced(style: NoteTypography): void {
    const detail = this.bodyEl!.createEl("details", { cls: "fp-compact-section fp-advanced-detail" });
    detail.createEl("summary", { text: "Headings" });
    this.renderFontControl(detail, "heading", "All H", "headingFamily", style);
    detail.createDiv({ text: "Heading levels", cls: "fp-compact-label fp-advanced-label" });
    const chips = detail.createDiv({ cls: "fp-heading-chips" });
    for (const level of HEADING_LEVELS) {
      const chip = chips.createEl("button", {
        text: "H" + level,
        cls: this.plugin.ui.activeHeadingLevel === level ? "is-active" : "",
        attr: { "aria-pressed": String(this.plugin.ui.activeHeadingLevel === level), "aria-label": `Edit heading ${level}` },
      });
      chip.addEventListener("click", (event) => {
        event.preventDefault();
        this.plugin.ui.activeHeadingLevel = level;
        this.plugin.saveUi();
        this.refreshAll();
        this.bodyEl?.querySelector<HTMLButtonElement>(`.fp-heading-chips button.is-active`)?.focus();
      });
    }
    const level = this.plugin.ui.activeHeadingLevel;
    const row = detail.createDiv({ cls: "fp-compact-row fp-heading-font-row" });
    const headingLabel = row.createSpan({ text: "H" + level + " font", cls: "fp-compact-role" });
    headingLabel.id = `fp-${this.previewId}-h${level}`;
    row.createSpan({ text: this.source("headingFamilies", level), cls: "fp-source" });
    this.renderFontPicker(row, style.headingFamilies?.[level] ?? style.headingFamily ?? "", (family) => {
      this.plugin.updateActiveTypography((next) => {
        next.headingFamilies = { ...next.headingFamilies, [level]: family || undefined };
      });
    }, headingLabel.id);
    const clear = row.createEl("button", { cls: "fp-compact-clear", attr: { "aria-label": "Use shared heading font" } });
    setIcon(clear, "rotate-ccw");
    clear.disabled = !this.plugin.activeOverrides.headingFamilies?.[level];
    clear.addEventListener("click", () => this.plugin.updateActiveTypography((next) => {
      next.headingFamilies = { ...next.headingFamilies, [level]: undefined };
    }));
    this.renderSlider(detail, "H" + level + " size", style.headingSizesEm?.[level] ?? [0, 2, 1.55, 1.3, 1.1, 1, 0.9][level], 0.8, 3, 0.05, "em", !!this.plugin.activeOverrides.headingSizesEm?.[level], (value) => {
      this.plugin.updateActiveTypography((next) => {
        next.headingSizesEm = { ...next.headingSizesEm, [level]: value };
      });
    }, () => this.plugin.updateActiveTypography((next) => {
      next.headingSizesEm = { ...next.headingSizesEm, [level]: undefined };
    }), this.source("headingSizesEm", level));
    this.renderSlider(detail, "H" + level + " line height", style.headingLineHeights?.[level] ?? 1.25, 0.9, 2, 0.05, "", !!this.plugin.activeOverrides.headingLineHeights?.[level], (value) => this.plugin.updateActiveTypography((next) => { next.headingLineHeights = { ...next.headingLineHeights, [level]: value }; }), () => this.plugin.updateActiveTypography((next) => { next.headingLineHeights = { ...next.headingLineHeights, [level]: undefined }; }), this.source("headingLineHeights", level));
    this.renderWeight(detail, "H" + level + " weight", style.headingWeights?.[level], this.source("headingWeights", level), (weight) => this.plugin.updateActiveTypography((next) => { next.headingWeights = { ...next.headingWeights, [level]: weight }; }));
  }

  private source(key: keyof NoteTypography, level?: HeadingLevel): string {
    const own = this.plugin.activeOverrides[key];
    if (level && own && typeof own === "object" && own[level] !== undefined) return this.plugin.ui.target === "note" ? "This note" : "All notes";
    if (!level && own !== undefined) return this.plugin.ui.target === "note" ? "This note" : "All notes";
    return this.plugin.ui.target === "note" && (level ? this.plugin.allNotesTypography[key] && (this.plugin.allNotesTypography[key] as Record<number, unknown>)[level] !== undefined : this.plugin.allNotesTypography[key] !== undefined) ? "All notes" : "Theme";
  }

  private renderWeight(parent: HTMLElement, label: string, value: number | undefined, source: string, commit: (value: number | undefined) => void): void {
    const row = parent.createDiv({ cls: "fp-weight-row" });
    row.createSpan({ text: label });
    row.createSpan({ text: source, cls: "fp-source" });
    const select = row.createEl("select", { attr: { "aria-label": label } });
    select.createEl("option", { text: this.plugin.ui.target === "note" ? "Inherited" : "Theme default", value: "" });
    for (let weight = 100; weight <= 900; weight += 100) select.createEl("option", { text: String(weight), value: String(weight) });
    select.value = value ? String(value) : "";
    select.addEventListener("change", () => commit(select.value ? Number(select.value) : undefined));
  }

  private renderFontPicker(parent: HTMLElement, value: string, selectFamily: (family: string) => void, labelId: string): void {
    const picker = parent.createDiv({ cls: "fp-font-picker" });
    const trigger = picker.createEl("button", { text: value || (this.plugin.ui.target === "note" ? "Inherited" : "Theme default"), cls: "fp-compact-font", attr: { "aria-expanded": "false" } });
    trigger.id = labelId + "-choice";
    trigger.setAttribute("aria-labelledby", labelId + " " + trigger.id);
    const menu = picker.createDiv({ cls: "fp-font-menu" });
    const search = menu.createEl("input", { type: "search", placeholder: "Search fonts…", attr: { "aria-label": "Search fonts" } });
    const list = menu.createDiv({ cls: "fp-font-list" });
    const close = () => { picker.removeClass("is-open", "is-up"); trigger.setAttribute("aria-expanded", "false"); };
    const open = () => {
      picker.addClass("is-open");
      trigger.setAttribute("aria-expanded", "true");
      const panelBottom = this.bodyEl?.getBoundingClientRect().bottom ?? window.innerHeight;
      if (menu.getBoundingClientRect().bottom > panelBottom - 8 && trigger.getBoundingClientRect().top > menu.offsetHeight + 8) picker.addClass("is-up");
      search.focus();
    };
    const render = () => {
      list.empty();
      const query = search.value.trim().toLowerCase();
      const inherit = list.createEl("button", { text: this.plugin.ui.target === "note" ? "Inherit All notes font" : "Use theme font" });
      inherit.addEventListener("click", () => selectFamily(""));
      let count = 0;
      for (const font of this.plugin.catalog.filter((item) => item.family.toLowerCase().includes(query))) {
        count++;
        const option = list.createEl("button", { text: font.family });
        option.style.fontFamily = cssFontFamily(font.family);
        option.addEventListener("mouseenter", () => ensureGoogleFontLoaded(font));
        option.addEventListener("focus", () => ensureGoogleFontLoaded(font));
        option.addEventListener("click", () => selectFamily(font.family));
      }
      if (!count) list.createDiv({ text: "No matching fonts", cls: "fp-font-empty" });
    };
    render();
    trigger.addEventListener("click", () => picker.hasClass("is-open") ? close() : open());
    search.addEventListener("input", render);
    picker.addEventListener("keydown", (event) => { if (event.key === "Escape") { close(); trigger.focus(); } });
    picker.addEventListener("focusout", (event) => { if (!picker.contains(event.relatedTarget as Node)) close(); });
  }

  private renderSlider(
    parent: HTMLElement, label: string, value: number, min: number, max: number, step: number,
    unit: string, overridden: boolean, commit: (value: number) => void, reset: () => void, source: string
  ): void {
    const row = parent.createDiv({ cls: "fp-compact-slider" });
    const top = row.createDiv({ cls: "fp-compact-slider-top" });
    const labelEl = top.createEl("label", { text: label });
    top.createSpan({ text: source, cls: "fp-source" });
    const output = top.createSpan({ text: String(value) + unit, cls: "fp-slider-value" });
    const clear = top.createEl("button", { cls: "fp-compact-clear fp-slider-clear", attr: { "aria-label": `Reset ${label.toLowerCase()} to ${this.plugin.ui.target === "note" ? "All notes" : "theme"} value`, title: `Reset ${label}` } });
    setIcon(clear, "rotate-ccw");
    clear.disabled = !overridden;
    clear.addEventListener("click", reset);
    const input = row.createEl("input", { type: "range" });
    const inputId = `fp-${this.previewId}-${label.toLowerCase().replace(/ /g, "-")}`;
    input.id = inputId;
    labelEl.htmlFor = inputId;
    input.min = String(min); input.max = String(max); input.step = String(step); input.value = String(value);
    input.addEventListener("input", () => {
      output.setText(input.value + unit);
    });
    input.addEventListener("change", () => commit(Number(input.value)));
  }

  private renderFooter(): void {
    const footer = this.bodyEl!.createDiv({ cls: "fp-compact-footer" });
    footer.createEl("button", { text: this.plugin.ui.target === "editor" ? "Reset All notes" : "Reset This note", cls: "fp-compact-reset" })
      .addEventListener("click", () => this.plugin.resetActiveTypography());
  }
}
