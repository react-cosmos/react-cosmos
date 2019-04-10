import express from 'express';
import { getStaticPath } from '../static';
import { CosmosConfig } from '../config';
import { getDevPlaygroundHtml } from '../playgroundHtml';
// import { setupHttpProxy } from '../shared/httpProxy';

export function createApp(cosmosConfig: CosmosConfig) {
  const app = express();

  // TODO: Create plugin
  // const { httpProxy } = cosmosConfig;
  // if (httpProxy) {
  //   setupHttpProxy(app, httpProxy);
  // }

  const playgroundHtml = getDevPlaygroundHtml(cosmosConfig);
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
