import fs from 'node:fs';
import path from 'node:path';
import { generateViteIndexHtml } from './generateViteIndexHtml.js';

export function ensureIndexHtml(rootDir: string) {
  const htmlPath = path.resolve(rootDir, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    console.log(
      `[Cosmos] Vite index.html not found, creating a default one...`
    );
    const html = generateViteIndexHtml();
    fs.writeFileSync(htmlPath, html);
    return html;
  }

  const html = fs.readFileSync(htmlPath, 'utf-8');
  // TODO: Add a default script if the user doesn't have one
  return html;
}
