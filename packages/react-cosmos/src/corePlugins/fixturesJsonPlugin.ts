import express from 'express';
import { sortBy } from 'lodash-es';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  CosmosMode,
  createRendererUrl,
  pickRendererUrl,
  removeFixtureNameExtension,
  removeFixtureNameSuffix,
} from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { CosmosServerPlugin } from '../cosmosPlugin/types.js';
import { findUserModulePaths } from '../userModules/findUserModulePaths.js';
import { importKeyPath } from '../userModules/shared.js';

export type CosmosFixtureJson = {
  filePath: string;
  cleanPath: string[];
  rendererUrl: string;
};

export type CosmosFixturesJson = {
  rendererUrl: string | null;
  fixtures: CosmosFixtureJson[];
};

export const fixturesJsonPlugin: CosmosServerPlugin = {
  name: 'fixturesJson',

  devServer({ cosmosConfig, expressApp }) {
    expressApp.get(
      '/cosmos.fixtures.json',
      async (req: express.Request, res: express.Response) => {
        res.json(await createFixtureItems(cosmosConfig, 'dev'));
      }
    );
  },

  async export({ cosmosConfig }) {
    const { exportPath } = cosmosConfig;
    const json = await createFixtureItems(cosmosConfig, 'export');
    await fs.writeFile(
      path.join(exportPath, 'cosmos.fixtures.json'),
      JSON.stringify(json, null, 2)
    );
  },
};

async function createFixtureItems(
  cosmosConfig: CosmosConfig,
  mode: CosmosMode
): Promise<CosmosFixturesJson> {
  const rendererUrl = pickRendererUrl(cosmosConfig.rendererUrl, mode);
  if (!rendererUrl) {
    return {
      rendererUrl: null,
      fixtures: [],
    };
  }

  const { fixturesDir, fixtureFileSuffix } = cosmosConfig;
  const { fixturePaths } = await findUserModulePaths(cosmosConfig);

  const fixtures = fixturePaths.map(filePath => {
    const relPath = importKeyPath(filePath, cosmosConfig.rootDir);
    const fixtureId = { path: relPath };
    return {
      filePath: relPath,
      cleanPath: cleanFixturePath(relPath, fixturesDir, fixtureFileSuffix),
      rendererUrl: createRendererUrl(rendererUrl, fixtureId, true),
    };
  });

  return {
    rendererUrl,
    fixtures: sortBy(fixtures, f => f.cleanPath.join('-')),
  };
}

function cleanFixturePath(
  filePath: string,
  fixturesDir: string,
  fixtureSuffix: string
) {
  const paths = filePath.split('/').filter(p => p !== fixturesDir);
  return [
    ...paths.slice(0, -1),
    removeFixtureNameSuffix(
      removeFixtureNameExtension(paths[paths.length - 1]),
      fixtureSuffix
    ),
  ];
}
