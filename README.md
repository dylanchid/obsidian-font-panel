# Typography

Set typography for this note or all Markdown notes.

## Use

Open **Typography** from the ribbon or command palette. Choose type settings for the active note or all Markdown notes, then preview and apply the result. Settings are stored in the plugin's Obsidian data file.

## Network use

When you select a Google Font, the plugin loads its stylesheet from `fonts.googleapis.com`; the browser then downloads font files from Google's font hosts. Local and system fonts do not use this service.

## Install manually

Run `npm ci && npm run build`, then copy `manifest.json`, `main.js`, and `styles.css` into `<vault>/.obsidian/plugins/font-panel/`. Enable the plugin under **Settings → Community plugins**.

## Develop

Run `npm ci` and `npm run build` from this directory.

## License

MIT. See [LICENSE](LICENSE).
