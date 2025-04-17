import { defaultMainScriptUrl } from './defaultMainScriptUrl.js';

export function generateViteIndexHtml() {
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
