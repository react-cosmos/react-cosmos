import express from 'express';
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
): Promise<express.Express> {
  const app = express();

  app.get('/', async (req: express.Request, res: express.Response) => {
    res.send(await getDevPlaygroundHtml(platform, cosmosConfig, pluginConfigs));
  });

  app.get(
    '/playground.bundle.js',
    (req: express.Request, res: express.Response) => {
      res.sendFile(resolve('react-cosmos-ui/dist/playground.bundle.js'));
    }
  );

  app.get(
    '/playground.bundle.js.map',
    (req: express.Request, res: express.Response) => {
      res.sendFile(resolve('react-cosmos-ui/dist/playground.bundle.js.map'));
    }
  );

  app.get('/_cosmos.ico', (req: express.Request, res: express.Response) => {
    res.sendFile(getStaticPath('favicon.ico'));
  });

  return app;
}
