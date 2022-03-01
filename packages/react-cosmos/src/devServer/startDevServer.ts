import path from 'path';
import {
  CosmosPluginConfig,
  DevServerPlugin,
  DevServerPluginCleanupCallback,
  PlatformType,
} from 'react-cosmos-plugin';
import {
  detectCosmosConfig,
  detectCosmosConfigPath,
} from '../config/detectCosmosConfig';
import { httpProxyDevServerPlugin } from '../plugins/httpProxy';
import { userDepsFileDevServerPlugin } from '../plugins/userDepsFile';
import { webpackDevServerPlugin } from '../plugins/webpack/webpackDevServerPlugin';
import { getPluginConfigs } from '../shared/pluginConfigs';
import { serveStaticDir } from '../shared/static';
import { createApp } from './app';
import { createHttpServer } from './httpServer';
import { createMessageHandler } from './messageHandler';

const corePlugins: DevServerPlugin[] = [
  webpackDevServerPlugin,
  userDepsFileDevServerPlugin,
  httpProxyDevServerPlugin,
];

export async function startDevServer(platformType: PlatformType) {
  const cosmosConfig = detectCosmosConfig();
  logCosmosConfigInfo();

  const pluginConfigs = getPluginConfigs(cosmosConfig);
  logPluginInfo(pluginConfigs);

  const app = createApp(platformType, cosmosConfig, pluginConfigs);
  if (cosmosConfig.staticPath) {
    serveStaticDir(app, cosmosConfig.staticPath, cosmosConfig.publicUrl);
  }

  const pluginCleanupCallbacks: DevServerPluginCleanupCallback[] = [];
  const httpServer = await createHttpServer(cosmosConfig, app);
  await httpServer.start();

  const msgHandler = createMessageHandler(httpServer.server);

  async function cleanUp() {
    await Promise.all(pluginCleanupCallbacks.map(cleanup => cleanup()));
    await httpServer.stop();
    msgHandler.cleanUp();
  }

  try {
    for (const plugin of corePlugins) {
      const pluginReturn = await plugin({
        cosmosConfig,
        platformType,
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

function logCosmosConfigInfo() {
  const cosmosConfigPath = detectCosmosConfigPath();
  if (!cosmosConfigPath) {
    console.log(`[Cosmos] Using default cosmos config`);
    return;
  }

  const relConfigPath = path.relative(process.cwd(), cosmosConfigPath);
  console.log(`[Cosmos] Using cosmos config found at ${relConfigPath}`);
}

function logPluginInfo(pluginConfigs: CosmosPluginConfig[]) {
  const pluginCount = pluginConfigs.length;
  if (pluginCount > 0) {
    const pluginLabel = pluginCount === 1 ? 'plugin' : 'plugins';
    const pluginNames = pluginConfigs.map(p => p.name).join(', ');
    console.log(`[Cosmos] Found ${pluginCount} ${pluginLabel}: ${pluginNames}`);
  }
}
