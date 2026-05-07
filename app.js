class AwesomeListGenerator {
  constructor() {
    this.project = this.loadDraft() || { title: "Awesome List", subtitle: "", sections: [] };
    
    // YOUR EXACT TEMPLATES from attached files [file:21][file:22]
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
      <p>{{FOOTER}}</p>
    </footer>
  </div>
</body></html>`,
      css: `:root {
color-scheme: light;
--bg: #f6f8fa;
--panel: #ffffff
