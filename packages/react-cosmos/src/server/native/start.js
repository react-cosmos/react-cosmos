// @flow

import { getCosmosConfig } from 'react-cosmos-config';
import {
  createServerApp,
  createServer,
  serveStaticDir
} from '../shared/server';
import { generateModulesFile } from './generate-modules-file';
import { attachSockets } from './socket';

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

  return async () => {
    await closeSockets();
    await stopServer();
  };
}

function getPlaygroundOpts({ rootPath }) {
  return {
    platform: 'native',
    projectKey: rootPath
  };
}
