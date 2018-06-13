// @flow

import { getCosmosConfig } from 'react-cosmos-config';
import {
  createServerApp,
  createServer,
  serveStaticDir
} from '../shared/server';

export async function startServer() {
  const cosmosConfig = getCosmosConfig();
  const { publicPath, publicUrl } = cosmosConfig;

  const app = createServerApp({
    cosmosConfig,
    playgroundOpts: getPlaygroundOpts(cosmosConfig)
  });
  const { startServer, stopServer } = createServer(cosmosConfig, app);

  if (publicPath) {
    serveStaticDir(app, publicUrl, publicPath);
  }

  await startServer();

  return async () => {
    await stopServer();
  };
}

function getPlaygroundOpts({ rootPath }) {
  return {
    projectKey: rootPath,
    loaderTransport: 'websockets'
  };
}
