import express from 'express';
import {
  FixtureList,
  createFixtureTree,
  createRendererUrl,
  flattenFixtureTree,
  pickRendererUrl,
} from 'react-cosmos-core';
import { CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { findUserModulePaths } from '../userModules/findUserModulePaths.js';
import { importKeyPath } from '../userModules/shared.js';

// TODO: Create Playwright test

export const fixturesJsonPlugin: CosmosServerPlugin = {
  name: 'fixturesJsonPlugin',

  devServer({ cosmosConfig, expressApp }) {
    expressApp.get(
      '/cosmos.fixtures.json',
      (req: express.Request, res: express.Response) => {
        const { fixturesDir, fixtureFileSuffix } = cosmosConfig;

        const rendererUrl = pickRendererUrl(cosmosConfig.rendererUrl, 'dev');
        if (!rendererUrl) {
          res.status(500).send('No renderer URL available');
          return;
        }

        const { fixturePaths } = findUserModulePaths(cosmosConfig);

        const fixtures = fixturePaths.reduce<FixtureList>((acc, p) => {
          const relPath = importKeyPath(p, cosmosConfig.rootDir);
          return { ...acc, [relPath]: { type: 'single' } };
        }, {});

        const fixtureTree = createFixtureTree({
          fixtures,
          fixturesDir,
          fixtureFileSuffix,
        });

        res.json(
          flattenFixtureTree(fixtureTree).map(item => {
            return {
              breadcrumbs: item.parents,
              // TODO: Should this be absolute in dev mode?
              filePath: item.fixtureId.path,
              fileName: item.fileName,
              // TODO: Make this absolute with webpack? What about exports?
              rendererUrl: createRendererUrl(rendererUrl, item.fixtureId, true),
            };
          }, {})
        );
      }
    );
  },

  export({ cosmosConfig }) {
    // TODO: Export fixtures JSON file
  },
};
