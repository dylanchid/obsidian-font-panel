import { MarkdownView, Notice, Plugin, TFile } from "obsidian";
import {
  DEFAULT_STUDIO_UI,
  HEADING_LEVELS,
  BASE_NOTE_PRESET,
  type FontEntry,
  type NoteTypography,
  type StudioData,
  type TypographyLoadout,
} from "./types";
import { buildCatalog, loadSystemFonts } from "./fonts";
import { applyTypography, removeStyleEl } from "./applyStyles";
import { FontPanelView, VIEW_TYPE_FONT_PANEL } from "./FontPanelView";

export default class FontPanelPlugin extends Plugin {
  catalog: FontEntry[] = [];
  private data: StudioData = {
    version: 6, ui: { ...DEFAULT_STUDIO_UI }, editor: {}, files: {}, loadouts: [],
  };
  private currentFilePath: string | null = null;
  private nextScopeId = 1;
  private scopeIds = new WeakMap<HTMLElement, string>();
  private saveQueue: Promise<void> = Promise.resolve();

  async onload(): Promise<void> {
    await this.loadStudioData();
    this.catalog = buildCatalog([]);
    this.registerView(VIEW_TYPE_FONT_PANEL, (leaf) => new FontPanelView(leaf, this));
    this.addRibbonIcon("type", "Typography", () => void this.activateView());
    this.addCommand({
      id: "open-design-studio",
      name: "Open Typography",
      callback: () => void this.activateView(),
    });

    this.registerEvent(this.app.workspace.on("file-open", (file) => {
      this.setCurrentFile(file);
      this.applyStyles();
    }));
    this.registerEvent(this.app.workspace.on("active-leaf-change", (leaf) => {
      if (leaf?.view instanceof MarkdownView) this.setCurrentFile(leaf.view.file);
      this.applyStyles();
    }));
    this.registerEvent(this.app.workspace.on("layout-change", () => this.applyStyles()));
    this.registerEvent(this.app.vault.on("rename", (file, oldPath) => {
      const saved = this.data.files[oldPath];
      if (!saved) return;
      delete this.data.files[oldPath];
      this.data.files[file.path] = saved;
      if (this.currentFilePath === oldPath) this.currentFilePath = file.path;
      void this.persist();
      this.applyStyles();
      this.refreshOpenViews();
    }));
    this.registerEvent(this.app.vault.on("delete", (file) => {
      if (!this.data.files[file.path]) return;
      delete this.data.files[file.path];
      if (this.currentFilePath === file.path) this.currentFilePath = null;
      void this.persist();
      this.applyStyles();
      this.refreshOpenViews();
    }));
    this.app.workspace.onLayoutReady(() => {
      this.setCurrentFile(this.app.workspace.getActiveViewOfType(MarkdownView)?.file ?? null);
      this.applyStyles();
    });
    void this.refreshSystemFonts();
  }

  onunload(): void {
    removeStyleEl();
    document.querySelectorAll("[data-font-panel-scope]").forEach((el) =>
      el.removeAttribute("data-font-panel-scope")
    );
    this.app.workspace.detachLeavesOfType(VIEW_TYPE_FONT_PANEL);
  }

  async activateView(): Promise<void> {
    const { workspace } = this.app;
    let leaf: import("obsidian").WorkspaceLeaf | undefined =
      workspace.getLeavesOfType(VIEW_TYPE_FONT_PANEL)[0];
    if (!leaf) {
      leaf = workspace.getRightLeaf(false) ?? undefined;
      if (!leaf) {
        new Notice("Could not open Typography — no sidebar leaf is available.");
        return;
      }
      await leaf.setViewState({ type: VIEW_TYPE_FONT_PANEL, active: true });
    }
    workspace.revealLeaf(leaf);
  }

  getActiveFilePath(): string | null {
    return this.currentFilePath;
  }

  get activeTypography(): NoteTypography {
    if (this.data.ui.target === "editor") return cloneTypography(this.data.editor);
    return this.currentFilePath
      ? mergeTypography(this.data.editor, this.data.files[this.currentFilePath] ?? {})
      : cloneTypography(this.data.editor);
  }

  get allNotesTypography(): NoteTypography { return cloneTypography(this.data.editor); }

  get activeOverrides(): NoteTypography {
    return this.data.ui.target === "editor"
      ? cloneTypography(this.data.editor)
      : cloneTypography(this.currentFilePath ? this.data.files[this.currentFilePath] ?? {} : {});
  }

  applyBasePreset(): void {
    this.data.editor = cloneTypography(BASE_NOTE_PRESET);
    void this.persist();
    this.applyStyles();
    this.refreshOpenViews();
  }

  get ui() {
    return this.data.ui;
  }

  get loadouts(): TypographyLoadout[] { return this.data.loadouts; }

  saveLoadout(name: string): void {
    const trimmed = name.trim();
    if (!trimmed) return;
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    this.data.loadouts.push({ id, name: trimmed, typography: cloneTypography(this.activeTypography) });
    void this.persist();
    this.refreshOpenViews();
  }

  applyLoadout(id: string): void {
    const loadout = this.data.loadouts.find((item) => item.id === id);
    if (!loadout) return;
    if (this.data.ui.target === "note" && !this.currentFilePath) return;
    this.saveActiveTypography(cloneTypography(loadout.typography));
  }

  hasSavedTypography(): boolean {
    return this.data.ui.target === "editor"
      ? Object.keys(this.data.editor).length > 0
      : !!this.currentFilePath && !!this.data.files[this.currentFilePath];
  }

  updateActiveTypography(update: (style: NoteTypography) => void): void {
    if (this.data.ui.target === "note" && !this.currentFilePath) return;
    const style = this.data.ui.target === "editor"
      ? cloneTypography(this.data.editor)
      : cloneTypography(this.data.files[this.currentFilePath!] ?? {});
    update(style);
    this.saveActiveTypography(style);
  }

  resetActiveTypography(): void {
    if (this.data.ui.target === "editor") this.data.editor = {};
    else if (this.currentFilePath) delete this.data.files[this.currentFilePath];
    else return;
    void this.persist();
    this.applyStyles();
    this.refreshOpenViews();
  }

  saveUi(): void {
    void this.persist();
  }

  refreshOpenViews(): void {
    for (const leaf of this.app.workspace.getLeavesOfType(VIEW_TYPE_FONT_PANEL)) {
      if (leaf.view instanceof FontPanelView) leaf.view.refreshAll();
    }
  }

  applyStyles(): void {
    document.querySelectorAll<HTMLElement>("[data-font-panel-scope]").forEach((el) =>
      el.removeAttribute("data-font-panel-scope")
    );
    const entries: Array<{ scopeSelector: string; settings: NoteTypography }> = [];
    for (const leaf of this.app.workspace.getLeavesOfType("markdown")) {
      const view = leaf.view;
      if (!(view instanceof MarkdownView) || !view.file) continue;
      const settings = mergeTypography(this.data.editor, this.data.files[view.file.path] ?? {});
      if (!Object.keys(settings).length) continue;
      let id = this.scopeIds.get(view.containerEl);
      if (!id) {
        id = `fp-${this.nextScopeId++}`;
        this.scopeIds.set(view.containerEl, id);
      }
      view.containerEl.setAttribute("data-font-panel-scope", id);
      entries.push({ scopeSelector: `[data-font-panel-scope="${id}"]`, settings });
    }
    applyTypography(entries, this.catalog);
  }

  private setCurrentFile(file: TFile | null): void {
    const path = file?.extension === "md" ? file.path : null;
    if (path === this.currentFilePath) return;
    this.currentFilePath = path;
    this.refreshOpenViews();
  }

  private saveActiveTypography(style: NoteTypography): void {
    const clean = cleanTypography(style);
    if (this.data.ui.target === "editor") this.data.editor = clean;
    else if (this.currentFilePath) {
      if (Object.keys(clean).length) this.data.files[this.currentFilePath] = clean;
      else delete this.data.files[this.currentFilePath];
    } else return;
    void this.persist();
    this.applyStyles();
    this.refreshOpenViews();
  }

  private async loadStudioData(): Promise<void> {
    const loaded = await this.loadData() as unknown;
    if (isStudioData(loaded)) {
      this.data = {
        version: 6,
        ui: { ...DEFAULT_STUDIO_UI, ...loaded.ui },
        editor: loaded.editor ?? {},
        files: loaded.files ?? {},
        loadouts: loaded.loadouts ?? [],
      };
      return;
    }
    if (isV5Data(loaded)) {
      await this.backupLegacyData(loaded);
      this.data = {
        version: 6,
        ui: { ...DEFAULT_STUDIO_UI, ...loaded.ui },
        editor: stripLegacyTypography(loaded.editor ?? {}),
        files: Object.fromEntries(Object.entries(loaded.files ?? {}).map(([path, style]) => [path, stripLegacyTypography(style)])),
        loadouts: [],
      };
      await this.persist();
      return;
    }
    if (isV4Data(loaded)) {
      this.data = {
        version: 6,
        ui: { ...DEFAULT_STUDIO_UI, ...loaded.ui },
        editor: {},
        files: Object.fromEntries(Object.entries(loaded.files ?? {}).map(([path, style]) => [path, stripLegacyTypography(style)])),
        loadouts: [],
      };
      void this.persist();
      return;
    }
    // Version 3 stored full resolved records. Keep only actual choices that
    // differ from its defaults, so migration restores theme inheritance.
    const legacy = loaded as { ui?: { activeRole?: StudioData["ui"]["activeRole"] }; files?: Record<string, LegacyStyle> } | null;
    const files: Record<string, NoteTypography> = {};
    for (const [path, style] of Object.entries(legacy?.files ?? {})) {
      const migrated: NoteTypography = {};
      if (style.body?.family) migrated.bodyFamily = style.body.family;
      if (style.heading?.family) migrated.headingFamily = style.heading.family;
      if (style.body?.sizePx && style.body.sizePx !== 16) migrated.bodySizePx = style.body.sizePx;
      if (Object.keys(migrated).length) files[path] = migrated;
    }
    this.data = {
      version: 6,
      ui: { ...DEFAULT_STUDIO_UI, activeRole: legacy?.ui?.activeRole ?? "body" },
      editor: {},
      files,
      loadouts: [],
    };
    void this.persist();
  }

  private persist(): Promise<void> {
    const snapshot = JSON.parse(JSON.stringify(this.data)) as StudioData;
    this.saveQueue = this.saveQueue.then(() => this.saveData(snapshot));
    return this.saveQueue;
  }

  private async backupLegacyData(loaded: unknown): Promise<void> {
    const path = `${this.app.vault.configDir}/plugins/${this.manifest.id}/data-v5-backup.json`;
    if (!await this.app.vault.adapter.exists(path)) {
      await this.app.vault.adapter.write(path, JSON.stringify(loaded, null, 2));
    }
  }

  private async refreshSystemFonts(): Promise<void> {
    this.catalog = buildCatalog(await loadSystemFonts());
    this.applyStyles();
    this.refreshOpenViews();
  }
}

interface LegacyStyle {
  body?: { family?: string; sizePx?: number };
  heading?: { family?: string };
  mono?: { family?: string };
  maxWidthPx?: number;
}

function isStudioData(value: unknown): value is StudioData {
  return !!value && typeof value === "object" && (value as { version?: unknown }).version === 6;
}

type LegacyNoteTypography = NoteTypography & { monoFamily?: string; readingWidthPx?: number };
function isV5Data(value: unknown): value is { version: 5; ui?: StudioData["ui"]; editor?: LegacyNoteTypography; files?: Record<string, LegacyNoteTypography> } {
  return !!value && typeof value === "object" && (value as { version?: unknown }).version === 5;
}

function stripLegacyTypography(style: LegacyNoteTypography): NoteTypography {
  const { monoFamily: _monoFamily, readingWidthPx: _readingWidthPx, ...typography } = style;
  return cleanTypography(typography);
}

function isV4Data(value: unknown): value is { version: 4; ui?: StudioData["ui"]; files?: Record<string, LegacyNoteTypography> } {
  return !!value && typeof value === "object" && (value as { version?: unknown }).version === 4;
}

function cloneTypography(style: NoteTypography): NoteTypography {
  return {
    ...style,
    headingFamilies: style.headingFamilies ? { ...style.headingFamilies } : undefined,
    headingSizesEm: style.headingSizesEm ? { ...style.headingSizesEm } : undefined,
    headingWeights: style.headingWeights ? { ...style.headingWeights } : undefined,
    headingLineHeights: style.headingLineHeights ? { ...style.headingLineHeights } : undefined,
  };
}

function mergeTypography(base: NoteTypography, override: NoteTypography): NoteTypography {
  return {
    ...base, ...override,
    headingFamilies: { ...base.headingFamilies, ...override.headingFamilies },
    headingSizesEm: { ...base.headingSizesEm, ...override.headingSizesEm },
  };
}

function cleanTypography(style: NoteTypography): NoteTypography {
  const clean = cloneTypography(style);
  if (clean.headingFamilies) {
    for (const level of Object.keys(clean.headingFamilies)) {
      if (!clean.headingFamilies[Number(level) as 1 | 2 | 3 | 4 | 5 | 6]) delete clean.headingFamilies[Number(level) as 1 | 2 | 3 | 4 | 5 | 6];
    }
    if (!Object.keys(clean.headingFamilies).length) delete clean.headingFamilies;
  }
  for (const key of ["headingSizesEm", "headingWeights", "headingLineHeights"] as const) {
    const values = clean[key];
    if (!values) continue;
    for (const level of HEADING_LEVELS) if (values[level] === undefined) delete values[level];
    if (!Object.keys(values).length) delete clean[key];
  }
  for (const key of Object.keys(clean) as Array<keyof NoteTypography>) {
    if (clean[key] === undefined || clean[key] === "") delete clean[key];
  }
  return clean;
}
