import path from 'path';
import {
  detectCosmosConfig,
  detectCosmosConfigPath,
} from '../cosmosConfig/detectCosmosConfig.js';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { getPluginConfigs } from '../cosmosPlugin/pluginConfigs.js';
import {
  CosmosPluginConfig,
  DevServerPlugin,
  DevServerPluginCleanupCallback,
  PlatformType,
} from '../cosmosPlugin/types.js';
import { logPluginInfo } from '../shared/logPluginInfo.js';
import { requirePluginModule } from '../shared/requirePluginModule.js';
import { serveStaticDir } from '../shared/staticServer.js';
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

  const app = await createApp(platformType, cosmosConfig, pluginConfigs);
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

  const devServerPlugins = await getDevServerPlugins(
    cosmosConfig,
    pluginConfigs
  );

  for (const plugin of [...corePlugins, ...devServerPlugins]) {
    try {
      const pluginReturn = await plugin({
        cosmosConfig,
        platformType,
        httpServer: httpServer.server,
        expressApp: app,
        sendMessage: msgHandler.sendMessage,
      });

      if (typeof pluginReturn === 'function') {
        pluginCleanupCallbacks.push(() => {
          try {
            pluginReturn();
          } catch (err) {
            // Log when a plugin fails to clean up, but continue to attempt
            // to clean up the remaining plugins
            console.log(
              `[Cosmos][${plugin.name}] Dev server plugin cleanup failed`
            );
            console.log(err);
          }
        });
      }
    } catch (err) {
      // Abort starting server if a plugin init fails and attempt cleanup of all
      // plugins that have already initialized
      console.log(`[Cosmos][${plugin.name}] Dev server plugin init failed`);
      cleanUp();
      throw err;
    }
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

async function getDevServerPlugins(
  cosmosConfig: CosmosConfig,
  pluginConfigs: CosmosPluginConfig[]
) {
  return Promise.all(
    pluginConfigs
      .filter(pluginConfig => pluginConfig.export)
      .map(pluginConfig =>
        requirePluginModule<DevServerPlugin>(
          cosmosConfig.rootDir,
          pluginConfig,
          'devServer'
        )
      )
  );
}
