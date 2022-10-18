import path from 'path';
import {
  detectCosmosConfig,
  detectCosmosConfigPath,
} from '../cosmosConfig/detectCosmosConfig.js';
import { getPluginConfigs } from '../cosmosPlugin/pluginConfigs.js';
import {
  CosmosPluginConfig,
  DevServerPlugin,
  DevServerPluginCleanupCallback,
  PlatformType,
} from '../cosmosPlugin/types.js';
import { serveStaticDir } from '../shared/staticServer.js';
import { requireModule } from '../utils/fs.js';
import { createApp } from './app.js';
import { httpProxyDevServerPlugin } from './corePlugins/httpProxy.js';
import openFileDevServerPlugin from './corePlugins/openFile.js';
import { userDepsFileDevServerPlugin } from './corePlugins/userDepsFile.js';
import { createHttpServer } from './httpServer.js';
import { createMessageHandler } from './messageHandler.js';

const corePlugins: DevServerPlugin[] = [
  userDepsFileDevServerPlugin,
  httpProxyDevServerPlugin,
  openFileDevServerPlugin,
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

  // TODO: Use pluginConfigs on top of corePlugins
  // ^^ this
  const devServerPlugins = pluginConfigs
    .filter(c => c.devServer)
    .map(
      c =>
        requireModule(path.resolve(cosmosConfig.rootDir, c.devServer!)).default
    );
  console.log(devServerPlugins);
  try {
    for (const plugin of [...corePlugins, ...devServerPlugins]) {
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
