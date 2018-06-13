// @flow

import { getCosmosConfig } from 'react-cosmos-config';
import {
  createServerApp,
  createServer,
  serveStaticDir
} from '../shared/server';
import { attachSockets } from './socket';

export async function startServer() {
  const cosmosConfig = getCosmosConfig();
  const { publicPath, publicUrl } = cosmosConfig;

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
    projectKey: rootPath,
    loaderTransport: 'websockets'
  };
}
