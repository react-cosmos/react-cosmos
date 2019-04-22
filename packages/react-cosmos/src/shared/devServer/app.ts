import express from 'express';
import { CosmosConfig } from '../../config';
import { getStaticPath } from '../static';
import { PlatformType } from '../shared';
import { getDevPlaygroundHtml } from '../playgroundHtml';

export function createApp(
  platformType: PlatformType,
  cosmosConfig: CosmosConfig
) {
  const app = express();

  const playgroundHtml = getDevPlaygroundHtml(platformType, cosmosConfig);
  app.get('/', (req: express.Request, res: express.Response) => {
    res.send(playgroundHtml);
  });

  app.get('/_playground.js', (req: express.Request, res: express.Response) => {
    res.sendFile(require.resolve('react-cosmos-playground2/dist'));
  });

  app.get('/_cosmos.ico', (req: express.Request, res: express.Response) => {
    res.sendFile(getStaticPath('favicon.ico'));
  });

  return app;
}
