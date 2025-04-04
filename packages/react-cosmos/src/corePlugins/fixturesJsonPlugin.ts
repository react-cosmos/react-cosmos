import { Request, Response } from 'express';
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

  devServer({ config, app }) {
    app.get('/cosmos.fixtures.json', async (_: Request, res: Response) => {
      res.json(await createFixtureItems(config, 'dev'));
    });
  },

  async export({ config }) {
    const { exportPath } = config;
    const json = await createFixtureItems(config, 'export');
    await fs.writeFile(
      path.join(exportPath, 'cosmos.fixtures.json'),
      JSON.stringify(json, null, 2)
    );
  },
};

async function createFixtureItems(
  config: CosmosConfig,
  mode: CosmosMode
): Promise<CosmosFixturesJson> {
  const rendererUrl = pickRendererUrl(config.rendererUrl, mode);
  if (!rendererUrl) {
    return {
      rendererUrl: null,
      fixtures: [],
    };
  }

  const { fixturesDir, fixtureFileSuffix } = config;
  const { fixturePaths } = await findUserModulePaths(config);

  const fixtures = fixturePaths.map(filePath => {
    const relPath = importKeyPath(filePath, config.rootDir);
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
