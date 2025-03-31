import { rename } from 'node:fs/promises';
import path from 'node:path';
import { ExportPluginArgs } from 'react-cosmos';
import { build } from 'vite';
import { RENDERER_FILENAME } from './constants.js';
import { createCosmosViteConfig } from './createCosmosViteConfig.js';
import { reactCosmosViteRollupPlugin } from './reactCosmosViteRollupPlugin.js';

export async function viteExportPlugin({ cosmosConfig }: ExportPluginArgs) {
  const { rootDir, exportPath, publicUrl } = cosmosConfig;
  const cosmosViteConfig = createCosmosViteConfig(cosmosConfig);

  const outDir = path.join(exportPath, publicUrl);
  await build({
    configFile: cosmosViteConfig.configPath,
    root: rootDir,
    base: publicUrl,
    build: {
      outDir,
      emptyOutDir: false,
      minify: false,
    },
    plugins: [
      reactCosmosViteRollupPlugin(cosmosConfig, 'export', cosmosViteConfig),
    ],
  });

  await rename(
    path.join(outDir, 'index.html'),
    path.join(outDir, RENDERER_FILENAME)
  );
}
