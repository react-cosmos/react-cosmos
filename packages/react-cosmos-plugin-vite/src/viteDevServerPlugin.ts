import {
  DevServerPluginArgs,
  startFixtureWatcher,
} from 'react-cosmos/server.js';
import { createServer } from 'vite';
import {
  reactCosmosViteRollupPlugin,
  userDepsResolvedModuleId,
} from './reactCosmosViteRollupPlugin.js';

export default async function viteDevServerPlugin({
  platformType,
  cosmosConfig,
}: DevServerPluginArgs) {
  if (platformType !== 'web') return;

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
      port: parseInt(new URL(rendererUrl).port, 10),
    },
    plugins: [reactCosmosViteRollupPlugin(cosmosConfig)],
  });
  await server.listen();

  server.printUrls();

  const watcher = await startFixtureWatcher(cosmosConfig, 'add', () => {
    const module = server.moduleGraph.getModuleById(userDepsResolvedModuleId);
    if (!module) {
      throw new Error(
        `Vite module graph doesn't contain module with id ${userDepsResolvedModuleId}`
      );
    }
    server.moduleGraph.invalidateModule(module);
    server.reloadModule(module);
  });

  return () => {
    watcher.close();
  };
}
