import { DevServerPluginArgs, startFixtureWatcher } from 'react-cosmos';
import { pickRendererUrl } from 'react-cosmos-core';
import { createServer } from 'vite';
import { createCosmosViteConfig } from './createCosmosViteConfig.js';
import {
  reactCosmosViteRollupPlugin,
  userImportsResolvedModuleId,
} from './reactCosmosViteRollupPlugin.js';

export async function viteDevServerPlugin({
  cosmosConfig,
  platform,
}: DevServerPluginArgs) {
  if (platform !== 'web') return;

  const rendererUrl = pickRendererUrl(cosmosConfig.rendererUrl, 'dev');
  if (!rendererUrl) {
    throw new Error('Vite plugin requires cosmosConfig.rendererUrl to be set');
  }

  const { rootDir } = cosmosConfig;
  const cosmosViteConfig = createCosmosViteConfig(cosmosConfig);

  const server = await createServer({
    // Last time I checked the config file is merged with this inline config:
    // https://github.com/vitejs/vite/blob/07bd6d14e545d05c6a29cf341f117fcfe9536ba4/packages/vite/src/node/config.ts#L418
    configFile: cosmosViteConfig.configPath,
    root: rootDir,
    base: cosmosConfig.publicUrl,
    server: {
      // https://vitejs.dev/config/server-options.html#server-host
      host: '0.0.0.0',
      port: parseInt(new URL(rendererUrl).port, 10),
      // Prevent auto opening Cosmos renderer in browser when user has this
      // option enabled in their Vite config
      open: false,
    },
    plugins: [
      reactCosmosViteRollupPlugin(cosmosConfig, cosmosViteConfig, 'dev'),
    ],
  });
  await server.listen();

  const watcher = await startFixtureWatcher(cosmosConfig, 'add', () => {
    const module = server.moduleGraph.getModuleById(
      userImportsResolvedModuleId
    );
    if (!module) {
      throw new Error(
        `Vite module graph doesn't contain module with id ${userImportsResolvedModuleId}`
      );
    }
    server.moduleGraph.invalidateModule(module);
    server.reloadModule(module);
  });

  return () => {
    watcher.close();
  };
}
