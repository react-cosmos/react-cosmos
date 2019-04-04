import {
  createApp,
  createServer,
  serveStaticDir,
  attachStackFrameEditorLauncher
} from '../shared/server';
import {
  getWebpack,
  getUserWebpackConfig,
  attachWebpack,
  getPublicPath
} from './webpack';
import { COSMOS_CONFIG, getRootDir, getPublicUrl } from '../shared/config';
import { slash } from '../shared/slash';
import { attachSockets } from '../shared/socket';
import { getPlaygroundConfig } from '../shared/playground';
import openFilePlugin from './plugins/openFile';

export async function startCosmosServer() {
  // TODO: Bring back config generation
  // if (!hasUserCosmosConfig()) {
  //   const generatedConfigFor = generateCosmosConfig();
  //   if (generatedConfigFor) {
  //     console.log(`[Cosmos] Nice! You're using ${generatedConfigFor}`);
  //     console.log('[Cosmos] Generated a tailored config file for your setup');
  //   }
  // }

  const cosmosConfig = COSMOS_CONFIG;
  const rootDir = getRootDir(cosmosConfig);
  const publicUrl = getPublicUrl(cosmosConfig);

  const userWebpack = getWebpack(rootDir);
  if (!userWebpack) {
    console.warn('[Cosmos] webpack dependency missing!');
    console.log('Install using "yarn add webpack" or "npm install webpack"');
    return () => {};
  }

  const playgroundConfig = getPlaygroundConfig({
    cosmosConfig,
    devServerOn: true,
    projectId: rootDir,
    webRendererUrl: slash(publicUrl, '_loader.html')
  });

  const app = createApp(cosmosConfig, playgroundConfig);
  const { server, startServer, stopServer } = createServer(cosmosConfig, app);

  const userWebpackConfig = getUserWebpackConfig(cosmosConfig, userWebpack);
  const publicPath = getPublicPath(cosmosConfig, userWebpackConfig);
  if (publicPath) {
    serveStaticDir(app, publicUrl, publicPath);
  }

  attachStackFrameEditorLauncher(app);
  openFilePlugin({ cosmosConfig, app });

  const { onWebpackDone, stopWebpack } = attachWebpack({
    cosmosConfig,
    app,
    userWebpack,
    userWebpackConfig
  });

  const closeSockets = attachSockets(server);
  await startServer();
  await onWebpackDone;

  return async () => {
    await stopWebpack();
    closeSockets();
    await stopServer();
  };
}
