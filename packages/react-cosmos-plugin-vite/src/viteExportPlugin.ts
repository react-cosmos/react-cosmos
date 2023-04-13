import viteReactPlugin from '@vitejs/plugin-react';
import { rename } from 'node:fs/promises';
import path from 'path';
import { ExportPluginArgs, RENDERER_FILENAME } from 'react-cosmos';
import { removeLeadingSlash } from 'react-cosmos-core';
import { build } from 'vite';
import { reactCosmosViteRollupPlugin } from './reactCosmosViteRollupPlugin.js';

export async function viteExportPlugin({ cosmosConfig }: ExportPluginArgs) {
  const { exportPath, publicUrl } = cosmosConfig;

  await build({
    configFile: false,
    root: cosmosConfig.rootDir,
    base: publicUrl,
    build: {
      outDir: path.resolve(exportPath, removeLeadingSlash(publicUrl)),
      emptyOutDir: false,
      minify: false,
    },
    plugins: [viteReactPlugin(), reactCosmosViteRollupPlugin(cosmosConfig)],
  });

  // Make way for the Playground's index.html
  await rename(
    path.resolve(exportPath, 'index.html'),
    path.resolve(exportPath, RENDERER_FILENAME)
  );
}
