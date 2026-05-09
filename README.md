# Awesome List Generator

A lightweight, client-side tool for curating and generating "awesome lists" in Markdown, CSV, and HTML format. No backend required — works entirely in your browser with localStorage persistence.

**[→ Live Demo](https://nuhbodyok.github.io/awesome-gen/)**

---

## Features

- **Entry Management** — Add, edit, delete, and categorize resources with title, URL, and description
- **Live Markdown Preview** — See your awesome list rendered in real-time as you work
- **Template System** — Use Markdown headings (`## Category Name`) to control where entries are inserted
- **Bulk Import** — Drag-and-drop or browse to import from CSV, TXT, or PDF files
  - CSV: `Title, URL, Description, Category`
  - TXT: Tab or comma-separated values
  - PDF: Auto-extracts URLs with contextual titles
- **Multiple Export Formats**
  - **Markdown** (`.md`) — Ready for GitHub README
  - **CSV** (`.csv`) — Spreadsheet compatible
  - **HTML** (`.html`) — Self-contained page with rendered Markdown
- **Persistent Storage** — All data saved to browser localStorage; survives page refreshes
- **GitHub Pages Ready** — Static HTML/CSS/JS, no build step, no dependencies to install

---

## Quick Start

### 1. Fork & Enable GitHub Pages

1. Fork this repository
2. Go to **Settings → Pages**
3. Select **Deploy from a branch** → `main` → `/ (root)`
4. Your site will be live at `https://yourusername.github.io/awesome-list-generator/`

### 2. Use Locally

Simply open `index.html` in any modern browser. No server required.

```bash
# Or serve with any static file server
npx serve .
python -m http.server 8000
```

---

## How to Use

### Adding Entries

1. Switch to the **Entries** tab
2. Fill in Title and URL (required)
3. Add a Description and Category (optional — defaults to "Uncategorized")
4. Click **Add Entry** or press Enter

### Using Templates

1. Switch to the **Template** tab
2. Edit the Markdown template or load your own `.md` file
3. Use headings like `## Frameworks` to match your entry categories
4. Entries automatically slot under their matching category heading in the preview

### Importing from Files

1. Switch to the **Import** tab
2. Drag and drop a `.csv`, `.txt`, or `.pdf` file onto the dropzone
3. Review the preview and click **Confirm Import**

### Exporting

Use the buttons in the top-right preview panel:
- **Copy MD** — Copy Markdown to clipboard
- **📄** — Download `README.md`
- **📊** — Download `awesome-list.csv`
- **🌐** — Download `awesome-list.html`

---

## File Structure

```
.
├── index.html          # Main application (single file, all-in-one)
└── README.md           # This file
```

That's it. The entire app is one self-contained HTML file with embedded CSS and JavaScript.

---

## Browser Compatibility

| Feature | Requirement |
|---------|-------------|
| Core app | Any modern browser (Chrome, Firefox, Safari, Edge) |
| PDF import | Requires `fetch` and dynamic `import()` support |
| Clipboard copy | Requires secure context (HTTPS or localhost) |
| localStorage | Standard in all modern browsers |

---

## Data Privacy

All data is stored **locally in your browser** via `localStorage`. Nothing is sent to any server. Clear your browser data to remove all stored entries and templates.

---

## License

[MIT](LICENSE) — Free to use, modify, and distribute.

---

## Contributing

Found a bug or have an idea? Open an [issue](../../issues) or submit a [pull request](../../pulls).
