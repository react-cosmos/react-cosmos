import chokidar from 'chokidar';
import { debounce } from 'lodash';
import { getCosmosConfig } from 'react-cosmos-config';
import {
  createServerApp,
  createServer,
  serveStaticDir
} from '../shared/server';
import { attachSockets } from '../shared/socket';
import { generateModulesFile } from './generate-modules-file';

export async function startServer() {
  const cosmosConfig = getCosmosConfig();
  const { publicPath, publicUrl } = cosmosConfig;

  await generateModulesFile(cosmosConfig);

  const app = createServerApp({
    cosmosConfig,
    playgroundOpts: getPlaygroundOpts(cosmosConfig)
  });
  const { server, startServer, stopServer } = createServer(cosmosConfig, app);

  if (publicPath) {
    serveStaticDir(app, publicUrl, publicPath);
  }

  const closeSockets = attachSockets(server);
  await startServer();

  const watcher = await startFixtureFileWatcher(cosmosConfig);

  return async () => {
    watcher.close();
    await closeSockets();
    await stopServer();
  };
}

function getPlaygroundOpts({ rootPath, plugin }) {
  return {
    platform: 'native',
    projectKey: rootPath,
    plugin
  };
}

async function startFixtureFileWatcher(cosmosConfig) {
  const { rootPath, fileMatch } = cosmosConfig;

  return new Promise(resolve => {
    const watcher = chokidar
      .watch(fileMatch, {
        ignored: getNormalizedIgnores(cosmosConfig),
        ignoreInitial: true,
        cwd: rootPath
      })
      .on('ready', () => resolve(watcher))
      .on(
        'all',
        debounce(() => {
          // Rebuild cosmos.modules file on fixture file changes
          generateModulesFile(cosmosConfig);
        }, 50)
      );
  });
}

function getNormalizedIgnores({ fileMatchIgnore, exclude }) {
  return Array.isArray(exclude)
    ? [fileMatchIgnore, ...exclude]
    : [fileMatchIgnore, exclude];
}
