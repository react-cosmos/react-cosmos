import { rename } from 'node:fs/promises';
import path from 'path';
import { ExportPluginArgs, RENDERER_FILENAME } from 'react-cosmos';
import { removeLeadingSlash } from 'react-cosmos-core';
import { build } from 'vite';
import { createCosmosViteConfig } from './createCosmosViteConfig.js';
import { getViteConfigFile } from './getViteConfigFile.js';
import { logViteConfigInfo } from './logViteConfigInfo.js';
import { reactCosmosViteRollupPlugin } from './reactCosmosViteRollupPlugin.js';

export async function viteExportPlugin({ cosmosConfig }: ExportPluginArgs) {
  const { rootDir, exportPath, publicUrl } = cosmosConfig;
  const viteCosmosConfig = createCosmosViteConfig(cosmosConfig);

  const configFile = getViteConfigFile(viteCosmosConfig.configPath, rootDir);
  logViteConfigInfo(configFile);

  await build({
    configFile,
    root: rootDir,
    base: publicUrl,
    build: {
      outDir: path.resolve(exportPath, removeLeadingSlash(publicUrl)),
      emptyOutDir: false,
      minify: false,
    },
    plugins: [reactCosmosViteRollupPlugin(cosmosConfig, viteCosmosConfig)],
  });

  // Make way for the Playground's index.html
  await rename(
    path.resolve(exportPath, 'index.html'),
    path.resolve(exportPath, RENDERER_FILENAME)
  );
}
