import type { Express, Request, Response } from 'express';
import express from 'express';
import type { CosmosPluginConfig } from 'react-cosmos-core';
import type { CosmosConfig } from '../cosmosConfig/types.js';
import type { CosmosPlatform } from '../cosmosPlugin/types.js';
import { getDevPlaygroundHtml } from '../shared/playgroundHtml.js';
import { getStaticPath } from '../shared/staticPath.js';
import { resolve } from '../utils/resolve.js';

export async function createExpressApp(
  platform: CosmosPlatform,
  config: CosmosConfig,
  pluginConfigs: CosmosPluginConfig[]
): Promise<Express> {
  const app = express();

  app.get('/', async (_: Request, res: Response) => {
    res.send(await getDevPlaygroundHtml(platform, config, pluginConfigs));
  });

  app.get('/playground.bundle.js', (_: Request, res: Response) => {
    res.sendFile(resolve('react-cosmos-ui/dist/playground.bundle.js'));
  });

  app.get('/playground.bundle.js.map', (_: Request, res: Response) => {
    res.sendFile(resolve('react-cosmos-ui/dist/playground.bundle.js.map'));
  });

  app.get('/_cosmos.ico', (_: Request, res: Response) => {
    res.sendFile(getStaticPath('favicon.ico'));
  });

  return app;
}
