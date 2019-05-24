import http from 'http';
import express from 'express';
import { Message } from 'react-cosmos-shared2/util';
import { CosmosConfig, getCosmosConfig } from '../../config';
import { PlatformType } from '../shared';
import { serveStaticDir } from '../static';
import { createHttpServer } from './httpServer';
import { createApp } from './app';
import { createMessageHandler } from './messageHandler';

type PluginCleanupCallback = () => unknown;
type PluginReturn = void | null | PluginCleanupCallback;

export type DevServerPluginArgs = {
  cosmosConfig: CosmosConfig;
  httpServer: http.Server;
  expressApp: express.Express;
  sendMessage(msg: Message): unknown;
};

export type DevServerPlugin = (
  args: DevServerPluginArgs
) => PluginReturn | Promise<PluginReturn>;

export async function startDevServer(
  platformType: PlatformType,
  plugins: DevServerPlugin[] = []
) {
  const cosmosConfig = getCosmosConfig();

  const app = createApp(platformType, cosmosConfig);
  if (cosmosConfig.staticPath) {
    serveStaticDir(app, cosmosConfig.staticPath, cosmosConfig.publicUrl);
  }

  const pluginCleanupCallbacks: PluginCleanupCallback[] = [];
  const httpServer = createHttpServer(cosmosConfig, app);
  await httpServer.start();

  const msgHandler = createMessageHandler(httpServer.server);

  async function cleanUp() {
    await pluginCleanupCallbacks.map(cleanup => cleanup());
    await httpServer.stop();
    msgHandler.cleanUp();
  }

  try {
    for (const plugin of plugins) {
      const pluginReturn = await plugin({
        cosmosConfig,
        httpServer: httpServer.server,
        expressApp: app,
        sendMessage: msgHandler.sendMessage
      });
      if (typeof pluginReturn === 'function') {
        pluginCleanupCallbacks.push(pluginReturn);
      }
    }
  } catch (err) {
    cleanUp();
    throw err;
  }

  return cleanUp;
}
