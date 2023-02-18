import { startFixtureWatcher } from 'react-cosmos/server.js';
import { createServer } from 'vite';
import { reactCosmosViteRollupPlugin } from './reactCosmosViteRollupPlugin.js';

const userDepsVirtualModuleId = 'virtual:cosmos-userdeps';
const userDepsResolvedModuleId = '\0' + userDepsVirtualModuleId;

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
        userDepsVirtualModuleId,
        userDepsResolvedModuleId,
        // TODO: Allow indexFile customization via cosmosConfig.vite.indexFile
        indexFile: undefined,
      }),
    ],
  });
  await server.listen();

  server.printUrls();

  const watcher = await startFixtureWatcher(cosmosConfig, 'add', () => {
    const module = server.moduleGraph.getModuleById(userDepsResolvedModuleId);
    server.moduleGraph.invalidateModule(module);
    server.reloadModule(module);
  });

  return () => {
    watcher.close();
  };
}
