import { startFixtureWatcher } from 'react-cosmos/server.js';
import { createServer } from 'vite';
import {
  reactCosmosViteRollupPlugin,
  resolvedReactCosmosUserDepsModuleId,
} from './reactCosmosViteRollupPlugin.js';

export default async function viteDevServerPlugin({ cosmosConfig }) {
  const { rendererUrl } = cosmosConfig;
  if (!rendererUrl) {
    throw new Error(
      'Vite plugin requires cosmosConfig.rendererUrl to be set (eg. "http://localhost:5050")'
    );
  }

  const server = await createServer({
    configFile: false,
    root: cosmosConfig.rootDir,
    server: {
      port: new URL(rendererUrl).port,
    },
    plugins: [
      reactCosmosViteRollupPlugin({
        cosmosConfig,
        // TODO: Allow indexFile customization via cosmosConfig.vite.indexFile
        indexFile: undefined,
      }),
    ],
  });
  await server.listen();

  server.printUrls();

  const watcher = await startFixtureWatcher(cosmosConfig, 'add', () => {
    const module = server.moduleGraph.getModuleById(
      resolvedReactCosmosUserDepsModuleId
    );
    server.moduleGraph.invalidateModule(module);
    server.reloadModule(module);
  });

  return () => {
    watcher.close();
  };
}
