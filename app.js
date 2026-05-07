class AwesomeListGenerator {
  constructor() {
    this.project = this.loadDraft() || { title: "Awesome List", subtitle: "", sections: [] };
    this.templates = {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title><!--TITLE--></title>
  <style>/*INLINE_CSS*/</style>
</head>
<body>
  <div class="container">
    <header class="site-header">
      <h1><!--TITLE--></h1>
      <p class="subtitle"><!--SUBTITLE--></p>
    </header>
    
    <!--SECTIONS-->
    
    <footer class="site-footer"><!--FOOTER--></footer>
  </div>
</body>
</html>`,
      css: `:root {
color-scheme: light;
--bg: #f6f8fa;
--panel: #ffffff;
--text: #24292f;
--muted: #57606a;
--link: #0969da;
--border: #d0d7de;
--shadow: rgba(27, 31, 36, 0.08);
}

* { box-sizing: border-box; }

html, body { margin: 0; padding: 0; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  line-height: 1.6;
  background: var(--bg);
  color: var(--text);
}

.container {
  max-width: 980px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
}

.site-header, .section, .site-footer {
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 1px 2px var(--shadow);
}

.site-header {
  padding: 1.5rem 1.5rem 1rem;
  margin-bottom: 1.5rem;
}

.site-header h1 {
  margin: 0 0 0.5rem;
  font-size: 2rem;
}

.subtitle {
  margin: 0;
  color: var(--muted);
}

.section {
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
}

.section h2 {
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
}

.link-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link-list li {
  margin: 0.5rem 0;
}

a {
  color: var(--link);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.site-footer {
  padding: 1rem 1.5rem;
  margin-top: 1.5rem;
  color: var(--muted);
}`
    };
    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
    window.addEventListener('keydown', (e) => this.handleKey(e));
  }

  bindEvents() {
    document.getElementById('newBtn').onclick = () => this.newProject();
    document.getElementById('saveBtn').onclick = () => this.saveDraft();
    document.getElementById('loadBtn').onclick = () => this.loadDraft();
    document.getElementById('exportMdBtn').onclick = () => this.export('md');
    document.getElementById('exportHtmlBtn').onclick = () => this.export('html');
    document.getElementById('csvInput').onchange = (e) => this.importCSV(e.target.files[0]);
    document.getElementById('addSectionBtn').onclick = () => this.addSection();
    document.getElementById('search').oninput = (e) => this.filterEntries(e.target.value);
    document.getElementById('exportFormat').onchange = () => this.updatePreview();
    document.getElementById('copyBtn').onclick = () => this.copyOutput();
    document.getElementById('downloadBtn').onclick = () => this.downloadOutput();
  }

  newProject() {
    if (confirm('Discard current work?')) {
      this.project = { title: "", subtitle: "", sections: [] };
      this.render();
      this.saveDraft();
    }
  }

  addSection() {
    const title = prompt('Section title:', 'New Section');
    if (title) {
      this.project.sections.push({ title, items: [] });
      this.render();
      this.autoSave();
    }
  }

  importCSV(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const lines = e.target.result.split(/\r?\n/).filter(Boolean);
      const items = lines.slice(1).map(line => {
        const [name, url, description] = line.split(',').map(s => s.trim().replace(/"/g, ''));
        return { name, url, description };
      }).filter(item => item.name && item.url);
      
      if (items.length) {
        const sectionName = prompt('Target section (or new):', file.name.replace('.csv', ''));
        const section = this.project.sections.find(s => s.title === sectionName) || 
                       (this.project.sections[this.project.sections.length] = { title: sectionName || 'Imported', items: [] });
        section.items.push(...items);
        this.render();
        this.autoSave();
      }
    };
    reader.readAsText(file);
  }

  filterEntries(query) {
    // Implementation for live filtering
    document.querySelectorAll('.entry').forEach(entry => {
      const text = entry.textContent.toLowerCase();
      entry.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
    });
  }

  render() {
    this.renderEditor();
    this.updatePreview();
    this.updateEntryCount();
    this.updateOutput();
  }

  renderEditor() {
    const container = document.getElementById('sectionsContainer');
    container.innerHTML = this.project.sections.map((section, secIdx) => `
      <div class="section-editor">
        <input class="section-title-input" value="${section.title}" 
               data-section="${secIdx}" placeholder="Section title">
        <div class="entries">
          ${section.items.map((item, idx) => `
            <div class="entry">
              <input class="entry-input entry-name" value="${item.name || ''}" data-section="${secIdx}" data-item="${idx}" placeholder="Name">
              <input class="entry-input entry-url" value="${item.url || ''}" data-section="${secIdx}" data-item="${idx}" placeholder="https://">
              <div class="entry-description">${item.description || ''}</div>
              <div class="entry-actions">
                <button onclick="app.moveItem(${secIdx}, ${idx}, 'up')">↑</button>
                <button onclick="app.moveItem(${secIdx}, ${idx}, 'down')">↓</button>
                <button onclick="app.removeItem(${secIdx}, ${idx})">×</button>
              </div>
            </div>
          `).join('')}
          <div class="entry">
            <button onclick="app.addItem(${secIdx})">+ Add entry</button>
          </div>
        </div>
      </div>
    `).join('');

    // Bind dynamic inputs
    container.querySelectorAll('input').forEach(input => {
      input.oninput = () => this.autoSave();
    });
  }

  addItem(secIdx) {
    this.project.sections[secIdx].items.push({ name: '', url: '', description: '' });
    this.render();
  }

  removeItem(secIdx, itemIdx) {
    this.project.sections[secIdx].items.splice(itemIdx, 1);
    this.render();
    this.autoSave();
  }

  moveItem(secIdx, itemIdx, direction) {
    const items = this.project.sections[secIdx].items;
    const otherIdx = direction === 'up' ? itemIdx - 1 : itemIdx + 1;
    if (otherIdx >= 0 && otherIdx < items.length) {
      [items[itemIdx], items[otherIdx]] = [items[otherIdx], items[itemIdx]];
      this.render();
      this.autoSave();
    }
  }

  updatePreview() {
    const preview = document.getElementById('preview');
    preview.innerHTML = this.toMarkdown();
  }

  updateOutput() {
    const format = document.getElementById('exportFormat').value;
    document.getElementById('output').value = format === 'md' ? this.toMarkdown() : this.toGitHubPages();
  }

  updateEntryCount() {
    const count = this.project.sections.reduce((sum, s) => sum + s.items.length, 0);
    document.getElementById('entryCount').textContent = count;
  }

  toMarkdown() {
    return `# ${this.project.title}\n\n${this.project.subtitle}\n\n` +
      this.project.sections.map(s => 
        `## ${s.title}\n\n${s.items.map(i => 
          `- [${i.name}](${i.url}) ${i.description ? `– ${i.description}` : ''}`
        ).join('\n')}`
      ).join('\n\n') + `\n\n*Generated with [Awesome List Generator](https://yourusername.github.io/repo)*`;
  }

  toGitHubPages() {
    const sectionsHtml = this.project.sections.map(section => `
      <section class="section">
        <h2>${this.escapeHtml(section.title)}</h2>
        <ul class="link-list">
          ${section.items.map(item => `
            <li>
              <a href="${this.escapeHtml(item.url)}" target="_blank" rel="noopener">${this.escapeHtml(item.name)}</a>
              ${item.description ? `<div>${this.escapeHtml(item.description)}</div>` : ''}
            </li>
          `).join('')}
        </ul>
      </section>
    `).join('');

    const footer = `Generated on ${new Date().toLocaleDateString()} with <a href="https://yourusername.github.io/repo">Awesome List Generator</a>`;

    return this.templates.html
      .replace(/<!--TITLE-->/g, this.escapeHtml(this.project.title))
      .replace('<!--SUBTITLE-->', this.escapeHtml(this.project.subtitle))
      .replace('<!--SECTIONS-->', sectionsHtml)
      .replace('<!--FOOTER-->', footer)
      .replace('/*INLINE_CSS*/', this.templates.css);
  }

  escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  autoSave() {
    // Debounced save
    clearTimeout(this.saveTimer);
    this.saveTimer = setTimeout(() => this.saveDraft(), 500);
  }

  saveDraft() {
    localStorage.setItem('awesome-list:v1', JSON.stringify(this.project));
  }

  loadDraft() {
    try {
      return JSON.parse(localStorage.getItem('awesome-list:v1'));
    } catch {
      return null;
    }
  }

  export(format) {
    const content = format === 'md' ? this.toMarkdown() : this.toGitHubPages();
    document.getElementById('output').value = content;
    document.getElementById('exportFormat').value = format;
  }

  copyOutput() {
    navigator.clipboard.writeText(document.getElementById('output').value);
  }

  downloadOutput() {
    const format = document.getElementById('exportFormat').value;
    const blob = new Blob([document.getElementById('output').value], { type: format === 'md' ? 'text/markdown' : 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.getElementById('downloadBtn');
    a.href = url;
    a.download = `${this.project.title || 'awesome-list'}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  handleKey(e) {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'n') { e.preventDefault(); this.newProject(); }
      if (e.key === 's') { e.preventDefault(); this.saveDraft(); }
      if (e.key === 'e') { e.preventDefault(); this.export('html'); }
      if (e.key === 'm') { e.preventDefault(); this.export('md'); }
    }
  }
}

const app = new AwesomeListGenerator();
