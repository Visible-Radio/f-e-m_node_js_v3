import fs from 'node:fs/promises';
import http from 'node:http';
import { getAllNotes } from './notes.js';

const DEFAULT_PORT = 1234;

const server = http.createServer(async (req, res) => {
  const HTML_PATH = new URL('./template.html', import.meta.url).pathname;
  const notes = await getAllNotes();
  const template = await fs.readFile(HTML_PATH, 'utf-8');
  const html = interpolate(template, { notes: formatNotes(notes) });
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

export function startServer(port) {
  const PORT = port ?? DEFAULT_PORT;
  server.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
  });
}

function interpolate(html, data) {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
    if (!(placeholder in data)) {
      throw new Error(
        `Found placeholder ${placeholder}, but there is no such key in the data`
      );
    }
    return data[placeholder];
  });
}

function formatNotes(notes) {
  return notes
    .map((note) => {
      return `<div class="note">
      <p>${note.content}</p>
      <div class="tags">${note?.tags
        ?.map((tag) => {
          return `<span class="tag" style="outline: 1px solid red">${
            tag ?? 'no tags'
          }<span>`;
        })
        .join('\n')}</div>
    </div>`;
    })
    .join('\n');
}
