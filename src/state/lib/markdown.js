// src/lib/markdown.js
// Lightweight markdown → HTML (no external dependencies)

export function renderMarkdown(text) {
  if (!text) return "";

  // Escape HTML entities first
  let html = text
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;");

  // Fenced code blocks: ```lang\ncode```
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
    `<div class="code-block"><div class="code-lang">${lang || "code"}</div><pre><code>${code.trim()}</code></pre></div>`
  );

  // Inline code: `code`
  html = html.replace(/`([^`\n]+)`/g, '<code class="inline-code">$1</code>');

  // Bold: **text**
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italic: *text*
  html = html.replace(/\*([^*\n]+)\*/g, "<em>$1</em>");

  // Headings
  html = html.replace(/^### (.+)$/gm, '<h3 class="md-h3">$1</h3>');
  html = html.replace(/^## (.+)$/gm,  '<h2 class="md-h2">$1</h2>');
  html = html.replace(/^# (.+)$/gm,   '<h1 class="md-h1">$1</h1>');

  // Unordered list items
  html = html.replace(/^[-*•] (.+)$/gm, '<li class="md-li">$1</li>');

  // Ordered list items
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="md-oli">$1</li>');

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li class="md-li">[\s\S]*?<\/li>(\n|<br\/>)*)+/g,
    match => `<ul class="md-ul">${match}</ul>`);

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="md-hr"/>');

  // Paragraphs from double newlines
  html = html
    .split(/\n\n+/)
    .map(block => {
      if (block.startsWith("<")) return block; // Already HTML
      return `<p class="md-p">${block}</p>`;
    })
    .join("");

  // Single newline → <br>
  html = html.replace(/([^>])\n([^<])/g, "$1<br/>$2");

  return html;
}