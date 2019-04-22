import http from 'http';
import express from 'express';
import { CosmosConfig, getCosmosConfig } from '../../config';
import { PlatformType } from '../shared';
import { serveStaticDir } from '../static';
import { createHttpServer } from './httpServer';
import { createApp } from './app';

type PluginCleanupCallback = () => unknown;
type PluginReturn = void | null | PluginCleanupCallback;

export type DevServerPluginArgs = {
  cosmosConfig: CosmosConfig;
  httpServer: http.Server;
  expressApp: express.Express;
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
  const httpServer = createHttpServer(cosmosConfig, app);

  if (cosmosConfig.staticPath) {
    serveStaticDir(app, cosmosConfig.staticPath, cosmosConfig.publicUrl);
  }

  await httpServer.start();

  const pluginCleanupCallbacks: PluginCleanupCallback[] = [];
  for (const plugin of plugins) {
    const pluginReturn = await plugin({
      cosmosConfig,
      httpServer: httpServer.server,
      expressApp: app
    });
    if (typeof pluginReturn === 'function') {
      pluginCleanupCallbacks.push(pluginReturn);
    }
  }

  return async () => {
    await pluginCleanupCallbacks.map(cleanup => cleanup());
    await httpServer.stop();
  };
}
