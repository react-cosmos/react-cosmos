import { rename } from 'node:fs/promises';
import path from 'node:path';
import { ExportPluginArgs } from 'react-cosmos';
import { build } from 'vite';
import { RENDERER_FILENAME } from './constants.js';
import { createCosmosViteConfig } from './createCosmosViteConfig.js';
import { reactCosmosViteRollupPlugin } from './reactCosmosViteRollupPlugin.js';

export async function viteExportPlugin({ config }: ExportPluginArgs) {
  const { rootDir, exportPath, publicUrl } = config;
  const viteConfig = createCosmosViteConfig(config);

  const outDir = path.join(exportPath, publicUrl);
  await build({
    configFile: viteConfig.configPath,
    root: rootDir,
    base: publicUrl,
    build: {
      outDir,
      emptyOutDir: false,
      minify: false,
    },
    plugins: [reactCosmosViteRollupPlugin(config, viteConfig, 'export')],
  });

  await rename(
    path.join(outDir, 'index.html'),
    path.join(outDir, RENDERER_FILENAME)
  );
}
