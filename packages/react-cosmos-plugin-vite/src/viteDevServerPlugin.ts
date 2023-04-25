import { DevServerPluginArgs, startFixtureWatcher } from 'react-cosmos';
import { createServer } from 'vite';
import { createCosmosViteConfig } from './createCosmosViteConfig.js';
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
  const viteCosmosConfig = createCosmosViteConfig(cosmosConfig);

  const configFile = getViteConfigFile(viteCosmosConfig.configPath, rootDir);
  logViteConfigInfo(configFile);

  const server = await createServer({
    // Last time I checked the config file is merged with this inline config:
    // https://github.com/vitejs/vite/blob/07bd6d14e545d05c6a29cf341f117fcfe9536ba4/packages/vite/src/node/config.ts#L418
    configFile,
    root: rootDir,
    server: {
      // https://vitejs.dev/config/server-options.html#server-host
      host: '0.0.0.0',
      port: parseInt(new URL(rendererUrl).port, 10),
    },
    plugins: [reactCosmosViteRollupPlugin(cosmosConfig, viteCosmosConfig)],
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
