import { DevServerPluginArgs, startFixtureWatcher } from 'react-cosmos';
import { createServer } from 'vite';
import { createViteCosmosConfig } from './createViteCosmosConfig.js';
import { getViteConfigFile } from './getViteConfigFile.js';
import { logViteConfigInfo } from './logViteConfigInfo.js';
import {
  reactCosmosViteRollupPlugin,
  userDepsResolvedModuleId,
} from './reactCosmosViteRollupPlugin.js';

export async function viteDevServerPlugin({
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

  const { rootDir } = cosmosConfig;
  const viteCosmosConfig = createViteCosmosConfig(cosmosConfig);

  const configFile = getViteConfigFile(viteCosmosConfig.configPath, rootDir);
  logViteConfigInfo(configFile);

  const server = await createServer({
    configFile,
    root: rootDir,
    server: {
      // https://vitejs.dev/config/server-options.html#server-host
      host: '0.0.0.0',
      port: parseInt(new URL(rendererUrl).port, 10),
    },
    plugins: [reactCosmosViteRollupPlugin(cosmosConfig)],
  });
  await server.listen();

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
