import path from 'node:path';

export function logViteConfigInfo(viteConfigPath: string | false) {
  if (viteConfigPath) {
    const relPath = path.relative(process.cwd(), viteConfigPath);
    console.log(`[Cosmos] Using vite config found at ${relPath}`);
  } else {
    console.log(`[Cosmos] No vite config found, using default settings`);
  }
}
