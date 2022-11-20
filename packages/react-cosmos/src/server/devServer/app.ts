import express from 'express';
import { createRequire } from 'node:module';
import { CosmosPluginConfig } from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { PlatformType } from '../cosmosPlugin/types.js';
import { getDevPlaygroundHtml } from '../shared/playgroundHtml.js';
import { getStaticPath } from '../shared/staticServer.js';
import { resolveFromSilent } from '../utils/resolveFromSilent.js';

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
    '/_plugin/:scriptPath',
    (req: express.Request, res: express.Response) => {
      const { scriptPath } = req.params;
      if (!scriptPath) {
        res.sendStatus(404);
        return;
      }

      // TODO: Restrict which scripts can be opened based on plugin configs
      const cleanPath = `./${decodeURIComponent(scriptPath)}`;
      const absolutePath = resolveFromSilent(cosmosConfig.rootDir, cleanPath);
      if (!absolutePath) {
        res.sendStatus(404);
        return;
      }

      res.sendFile(absolutePath);
    }
  );

  app.get('/_playground.js', (req: express.Request, res: express.Response) => {
    const require = createRequire(import.meta.url);
    res.sendFile(require.resolve('react-cosmos-ui/dist/playground.bundle.js'));
  });

  app.get('/_cosmos.ico', (req: express.Request, res: express.Response) => {
    res.sendFile(getStaticPath('favicon.ico'));
  });

  return app;
}
