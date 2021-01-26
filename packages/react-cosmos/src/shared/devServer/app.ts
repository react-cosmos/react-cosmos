import express from 'express';
import { CosmosPluginConfig } from 'react-cosmos-plugin';
import resolveFrom from 'resolve-from';
import { CosmosConfig } from '../../config';
import { getDevPlaygroundHtml } from '../playgroundHtml';
import { PlatformType } from '../shared';
import { getStaticPath } from '../static';

export function createApp(
  platformType: PlatformType,
  cosmosConfig: CosmosConfig,
  pluginConfigs: CosmosPluginConfig[]
): express.Express {
  const app = express();

  const playgroundHtml = getDevPlaygroundHtml(
    platformType,
    cosmosConfig,
    pluginConfigs
  );
  app.get('/', (req: express.Request, res: express.Response) => {
    res.send(playgroundHtml);
  });

  app.get(
    '/_plugin/:scriptPath',
    (req: express.Request, res: express.Response) => {
      const { scriptPath } = req.params;
      if (!scriptPath) {
        res.sendStatus(404);
        return;
      }

      // TODO: Restrict which scripts can be opened based on plugin configs
      const cleanPath = `./${decodeURIComponent(scriptPath)}`;
      const absolutePath = resolveFrom.silent(cosmosConfig.rootDir, cleanPath);
      if (!absolutePath) {
        res.sendStatus(404);
        return;
      }

      res.sendFile(absolutePath);
    }
  );

  app.get('/_playground.js', (req: express.Request, res: express.Response) => {
    res.sendFile(require.resolve('react-cosmos-playground2/dist'));
  });

  app.get('/_cosmos.ico', (req: express.Request, res: express.Response) => {
    res.sendFile(getStaticPath('favicon.ico'));
  });

  return app;
}
