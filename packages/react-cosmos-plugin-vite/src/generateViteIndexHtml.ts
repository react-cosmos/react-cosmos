import { moduleExists } from 'react-cosmos';

const tsMainPath = 'src/main.tsx';
const jsMainPath = 'src/main.jsx';

export function generateViteIndexHtml() {
  const mainPath = moduleExists('typescript') ? tsMainPath : jsMainPath;

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Cosmos Vite Renderer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/${mainPath}"></script>
  </body>
</html>\n`;
}
