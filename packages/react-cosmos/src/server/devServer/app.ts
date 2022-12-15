import express from 'express';
import { CosmosPluginConfig } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { PlatformType } from '../cosmosPlugin/types.js';
import { getDevPlaygroundHtml } from '../shared/playgroundHtml.js';
import { getStaticPath } from '../shared/staticPath.js';
import { resolve } from '../utils/resolve.js';

export async function createApp(
  platformType: PlatformType,
  cosmosConfig: CosmosConfig,
  pluginConfigs: CosmosPluginConfig[]
): Promise<express.Express> {
  const app = express();

  const playgroundHtml = await getDevPlaygroundHtml(
    platformType,
    cosmosConfig,
    pluginConfigs
  );
  app.get('/', (req: express.Request, res: express.Response) => {
    res.send(playgroundHtml);
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
