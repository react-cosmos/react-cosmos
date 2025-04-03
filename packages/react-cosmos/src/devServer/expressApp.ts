import express, { Express, Request, Response } from 'express';
import { CosmosPluginConfig } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { CosmosPlatform } from '../cosmosPlugin/types.js';
import { getDevPlaygroundHtml } from '../shared/playgroundHtml.js';
import { getStaticPath } from '../shared/staticPath.js';
import { resolve } from '../utils/resolve.js';

export async function createExpressApp(
  platform: CosmosPlatform,
  cosmosConfig: CosmosConfig,
  pluginConfigs: CosmosPluginConfig[]
): Promise<Express> {
  const app = express();

  app.get('/', async (_: Request, res: Response) => {
    res.send(await getDevPlaygroundHtml(platform, cosmosConfig, pluginConfigs));
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
