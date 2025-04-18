import path from 'path';
import {
  detectCosmosConfig,
  detectCosmosConfigPath,
} from '../cosmosConfig/detectCosmosConfig.js';
import { getPluginConfigs } from '../cosmosPlugin/pluginConfigs.js';
import { CosmosPlatform } from '../cosmosPlugin/types.js';
import { applyServerConfigPlugins } from '../shared/applyServerConfigPlugins.js';
import { getServerPlugins } from '../shared/getServerPlugins.js';
import { logPluginInfo } from '../shared/logPluginInfo.js';
import { logPlaygroundUrls } from '../shared/playgroundUrl.js';
import { serveStaticDir } from '../shared/staticServer.js';
import { createExpressApp } from './expressApp.js';
import { createHttpServer } from './httpServer.js';
import { createMessageHandler } from './messageHandler.js';

export async function startDevServer(platform: CosmosPlatform) {
  let config = await detectCosmosConfig();
  logCosmosConfigInfo();

  const pluginConfigs = await getPluginConfigs({
    config,
    // Absolute paths are required in dev mode because the dev server could
    // run in a monorepo package that's not the root of the project and plugins
    // could be installed in the root
    relativePaths: false,
  });
  logPluginInfo(pluginConfigs);

  const serverPlugins = await getServerPlugins(pluginConfigs, config.rootDir);

  config = await applyServerConfigPlugins({
    config,
    serverPlugins,
    mode: 'dev',
    platform,
  });

  const app = await createExpressApp(platform, config, pluginConfigs);
  const httpServer = await createHttpServer(config, app);
  const msgHandler = createMessageHandler(httpServer.server);

  if (config.staticPath) {
    serveStaticDir(app, config.staticPath, config.publicUrl);
  }

  // Make Playground available as soon as possible and show a loading screen
  // while plugins are initializing
  await httpServer.start();

  const pluginCleanupCallbacks: (() => Promise<void>)[] = [];

  async function cleanUp() {
    await Promise.all(pluginCleanupCallbacks.map(cleanup => cleanup()));
    msgHandler.close();
    await httpServer.stop();
  }

  for (const plugin of serverPlugins) {
    try {
      if (!plugin.devServer) continue;

      const pluginReturn = await plugin.devServer({
        config,
        platform,
        httpServer: httpServer.server,
        app,
        sendMessage: msgHandler.sendMessage,
      });

      if (typeof pluginReturn === 'function') {
        pluginCleanupCallbacks.push(async () => {
          try {
            await pluginReturn();
          } catch (err) {
            // Log when a plugin fails to clean up, but continue to attempt
            // to clean up the remaining plugins
            console.log(`[Cosmos][${plugin.name}] Dev server cleanup failed`);
            console.log(err);
          }
        });
      }
    } catch (err) {
      // Abort starting server if a plugin init fails and attempt cleanup of all
      // plugins that have already initialized
      console.log(`[Cosmos][${plugin.name}] Dev server init failed`);
      cleanUp();
      throw err;
    }
  }

  logPlaygroundUrls(config);

  return cleanUp;
}

function logCosmosConfigInfo() {
  const cosmosConfigPath = detectCosmosConfigPath();
  if (!cosmosConfigPath) {
    console.log(`[Cosmos] Using default Cosmos config`);
    return;
  }

  const relConfigPath = path.relative(process.cwd(), cosmosConfigPath);
  console.log(`[Cosmos] Using config found at ${relConfigPath}`);
}
