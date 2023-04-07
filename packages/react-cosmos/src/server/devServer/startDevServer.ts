import path from 'path';
import {
  detectCosmosConfig,
  detectCosmosConfigPath,
} from '../cosmosConfig/detectCosmosConfig.js';
import { getPluginConfigs } from '../cosmosPlugin/pluginConfigs.js';
import {
  DevServerPluginCleanupCallback,
  PlatformType,
} from '../cosmosPlugin/types.js';
import { importServerPlugins } from '../shared/importServerPlugins.js';
import { logPluginInfo } from '../shared/logPluginInfo.js';
import { serveStaticDir } from '../shared/staticServer.js';
import { coreServerPlugins } from './corePlugins/index.js';
import { createExpressApp } from './expressApp.js';
import { createHttpServer } from './httpServer.js';
import { createMessageHandler } from './messageHandler.js';

export async function startDevServer(platformType: PlatformType) {
  let cosmosConfig = await detectCosmosConfig();
  logCosmosConfigInfo();

  const pluginConfigs = await getPluginConfigs({
    cosmosConfig,
    // Absolute paths are required in dev mode because the dev server could
    // run in a monorepo package that's not the root of the project and plugins
    // could be installed in the root
    relativePaths: false,
  });
  logPluginInfo(pluginConfigs);

  const userPlugins = await importServerPlugins(
    pluginConfigs,
    cosmosConfig.rootDir
  );
  const plugins = [...coreServerPlugins, ...userPlugins];

  for (const plugin of plugins) {
    if (plugin.config) {
      cosmosConfig = await plugin.config({ cosmosConfig, platformType });
    }
  }

  const app = await createExpressApp(platformType, cosmosConfig, pluginConfigs);
  const httpServer = await createHttpServer(cosmosConfig, app);
  const msgHandler = createMessageHandler(httpServer.server);

  // Make Playground available as soon as possible and show a loading screen
  // while plugins are initializing
  await httpServer.start();

  const pluginCleanupCallbacks: DevServerPluginCleanupCallback[] = [];

  async function cleanUp() {
    await Promise.all(pluginCleanupCallbacks.map(cleanup => cleanup()));
    msgHandler.close();
    await httpServer.stop();
  }

  for (const plugin of plugins) {
    try {
      if (!plugin.devServer) continue;

      const pluginReturn = await plugin.devServer({
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

  if (cosmosConfig.staticPath) {
    serveStaticDir(app, cosmosConfig.staticPath, cosmosConfig.publicUrl);
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
