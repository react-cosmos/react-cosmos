import express from 'express';
import http from 'http';
import { Message } from 'react-cosmos-shared2/util';
import { CosmosConfig, detectCosmosConfig } from '../../config';
import { getPluginConfigs } from '../pluginConfigs';
import { PlatformType } from '../shared';
import { serveStaticDir } from '../static';
import { createApp } from './app';
import { createHttpServer } from './httpServer';
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
  const cosmosConfig = detectCosmosConfig();
  const pluginConfigs = getPluginConfigs(cosmosConfig);

  const pluginCount = pluginConfigs.length;
  if (pluginCount > 0) {
    const pluginLabel = pluginCount === 1 ? 'plugin' : 'plugins';
    const pluginNames = pluginConfigs.map(p => p.name).join(', ');
    console.log(`[Cosmos] Found ${pluginCount} ${pluginLabel}: ${pluginNames}`);
  }

  const app = createApp(platformType, cosmosConfig, pluginConfigs);
  if (cosmosConfig.staticPath) {
    serveStaticDir(app, cosmosConfig.staticPath, cosmosConfig.publicUrl);
  }

  const pluginCleanupCallbacks: PluginCleanupCallback[] = [];
  const httpServer = await createHttpServer(cosmosConfig, app);
  await httpServer.start();

  const msgHandler = createMessageHandler(httpServer.server);

  async function cleanUp() {
    await Promise.all(pluginCleanupCallbacks.map(cleanup => cleanup()));
    await httpServer.stop();
    msgHandler.cleanUp();
  }

  try {
    for (const plugin of plugins) {
      const pluginReturn = await plugin({
        cosmosConfig,
        httpServer: httpServer.server,
        expressApp: app,
        sendMessage: msgHandler.sendMessage,
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
