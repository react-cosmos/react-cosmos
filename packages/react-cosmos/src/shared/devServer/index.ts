import http from 'http';
import express from 'express';
import { CosmosConfig, getCosmosConfig } from '../../config';
import { PlatformType } from '../shared';
import { serveStaticDir } from '../static';
import { createHttpServer } from './httpServer';
import { createApp } from './app';
// IDEA: Maybe replace react-dev-utils with https://github.com/yyx990803/launch-editor
// import launchEditor from 'react-dev-utils/launchEditor';

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
  // TODO: Bring back config generation
  // if (!hasUserCosmosConfig()) {
  //   const generatedConfigFor = generateCosmosConfig();
  //   if (generatedConfigFor) {
  //     console.log(`[Cosmos] Nice! You're using ${generatedConfigFor}`);
  //     console.log('[Cosmos] Generated a tailored config file for your setup');
  //   }
  // }
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

  // TODO: Bring back attachStackFrameEditorLauncher
  // attachStackFrameEditorLauncher(app);

  return async () => {
    await pluginCleanupCallbacks.map(cleanup => cleanup());
    await httpServer.stop();
  };
}

// TODO: Make plugin
// export function attachStackFrameEditorLauncher(app: express.Application) {
//   app.get(
//     '/__open-stack-frame-in-editor',
//     (req: express.Request, res: express.Response) => {
//       const lineNumber = parseInt(req.query.lineNumber, 10) || 1;
//       const colNumber = parseInt(req.query.colNumber, 10) || 1;
//       launchEditor(req.query.fileName, lineNumber, colNumber);
//       res.end();
//     }
//   );
// }
