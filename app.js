class AwesomeListGenerator {
  constructor() {
    // ... rest unchanged until templates ...
    
    // Load your EXACT templates from the attached files
    this.templates = {
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{{TITLE}}</title>
  <style>
{{CSS}}
  </style>
</head>
<body>
  <div class="container">
    <header class="site-header">
      <h1>{{TITLE}}</h1>
      <p class="subtitle">{{SUBTITLE}}</p>
    </header>
    
    {{SECTIONS}}
    
    <footer class="site-footer">
      {{FOOTER}}
    </footer>
  </div>
</body>
</html>`,
      css: `{{EXACT_CSS_FROM_FILE_22}}`  // This gets replaced with your full CSS
    };
    
    // Fetch your actual CSS template content (simulates reading file:22)
    this.loadTemplates();
    this.init();
  }

  async loadTemplates() {
    // In production, these would be fetched from your attached files
    // For now, using the exact content you uploaded [file:22]
    this.templates.css = `:root {
color-scheme: light;
--bg: #f6f8fa;
--panel: #ffffff;
--text: #24292f;
--muted: #57606a;
--link: #0969da;
--border: #d0d7de;
--shadow: rgba(27, 31, 36, 0.08);
}

* {
box-sizing: border-box;
}

html, body {
margin: 0;
padding: 0;
}

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

.site-header,
.section,
.site-footer {
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
}`;
  }

  toGitHubPages() {
    const sectionsHtml = this.project.sections.map(section => `
      <section class="section">
        <h2>${this.escapeHtml(section.title)}</h2>
        <ul class="link-list">
          ${section.items.map(item => `
            <li>
              <a href="${this.escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
                ${this.escapeHtml(item.name)}
              </a>
              ${item.description ? `<br><small>${this.escapeHtml(item.description)}</small>` : ''}
            </li>
          `).join('\n')}
        </ul>
      </section>
    `).join('\n\n');

    const output = this.templates.html
      .replace(/{{TITLE}}/g, this.escapeHtml(this.project.title || 'Awesome List'))
      .replace('{{SUBTITLE}}', this.escapeHtml(this.project.subtitle))
      .replace('{{SECTIONS}}', sectionsHtml)
      .replace('{{FOOTER}}', `Generated ${new Date().toLocaleDateString()}`)
      .replace('{{CSS}}', this.templates.css);

    return output;
  }

  // ... rest of methods unchanged
}
