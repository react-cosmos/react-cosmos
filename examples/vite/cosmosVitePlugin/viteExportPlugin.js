import { rename } from 'node:fs/promises';
import path from 'path';
import { removeLeadingSlash } from 'react-cosmos-core';
import { RENDERER_FILENAME } from 'react-cosmos/server.js';
import { build } from 'vite';
import { reactCosmosViteRollupPlugin } from './reactCosmosViteRollupPlugin.js';

export default async function viteExportPlugin({ cosmosConfig }) {
  const { exportPath, publicUrl } = cosmosConfig;

  await build({
    configFile: false,
    root: cosmosConfig.rootDir,
    base: publicUrl,
    build: {
      outDir: path.resolve(exportPath, removeLeadingSlash(publicUrl)),
      minify: false,
    },
    plugins: [reactCosmosViteRollupPlugin(cosmosConfig)],
  });

  // Make way for the Playground's index.html
  await rename(
    path.resolve(exportPath, 'index.html'),
    path.resolve(exportPath, RENDERER_FILENAME)
  );
}
