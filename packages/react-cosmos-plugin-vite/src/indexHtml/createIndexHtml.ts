import fs from 'node:fs';
import { defaultMainScriptUrl } from './defaultMainScriptUrl.js';

export function createIndexHtml(htmlPath: string) {
  console.log(`[Cosmos] Vite index.html not found, creating a default one...`);
  const html = generateViteIndexHtml();
  fs.writeFileSync(htmlPath, html);
  return html;
}

function generateViteIndexHtml() {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Cosmos Vite Renderer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${defaultMainScriptUrl()}"></script>
  </body>
</html>\n`;
}
