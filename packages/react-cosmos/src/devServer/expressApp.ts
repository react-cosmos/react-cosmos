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
    // The HTML is not cached between requests because it contains a list of
    // fixtures that get stale once the user adds/removes/renames fixture files
    // after the server has started. If this proves to be inefficient we can:
    //  - Cache the HTML and invalidate it when fixture files change by using
    //    the fixture watcher at userModules/fixtureWatcher.ts. This requires
    //    some work to implement cleanly and can create tech debt.
    //  - Add an option to cache the HTML once and keep the embedded fixture
    //    list state until the server restarts. This results in a minor glitch
    //    when the renderer connects and sends the updated fixture list, and
    //    could be a reasonable tradeoff for large projects.
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
