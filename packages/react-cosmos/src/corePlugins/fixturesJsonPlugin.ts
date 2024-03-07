import express from 'express';
import {
  CosmosCommand,
  FixtureList,
  createFixtureTree,
  createRendererUrl,
  flattenFixtureTree,
  pickRendererUrl,
} from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
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
        res.json(getFixtureItems(cosmosConfig, 'dev'));
      }
    );
  },

  export({ cosmosConfig }) {
    // TODO: Export fixtures JSON file
  },
};

type FixtureItem = {
  filePath: string;
  fileName: string;
  parents: string[];
  rendererUrl: string;
};

function getFixtureItems(
  cosmosConfig: CosmosConfig,
  command: CosmosCommand
): FixtureItem[] {
  const rendererUrl = pickRendererUrl(cosmosConfig.rendererUrl, command);
  if (!rendererUrl) {
    throw new Error('No renderer URL available');
  }

  const { fixturesDir, fixtureFileSuffix } = cosmosConfig;
  const { fixturePaths } = findUserModulePaths(cosmosConfig);

  const fixtures = fixturePaths.reduce<FixtureList>((acc, p) => {
    const relPath = importKeyPath(p, cosmosConfig.rootDir);
    return { ...acc, [relPath]: { type: 'single' } };
  }, {});

  return flattenFixtureTree(
    createFixtureTree({ fixtures, fixturesDir, fixtureFileSuffix })
  ).map(item => {
    return {
      filePath: item.fixtureId.path,
      fileName: item.fileName,
      parents: item.parents,
      // TODO: Make this absolute with webpack? What about exports?
      rendererUrl: createRendererUrl(rendererUrl, item.fixtureId, true),
    };
  }, {});
}
