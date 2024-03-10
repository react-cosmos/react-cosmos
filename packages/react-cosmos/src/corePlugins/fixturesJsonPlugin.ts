import express from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  CosmosCommand,
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
  name: 'fixturesJsonPlugin',

  devServer({ cosmosConfig, expressApp }) {
    expressApp.get(
      '/cosmos.fixtures.json',
      (req: express.Request, res: express.Response) => {
        res.json(createFixtureItems(cosmosConfig, 'dev'));
      }
    );
  },

  async export({ cosmosConfig }) {
    const { exportPath } = cosmosConfig;
    const json = createFixtureItems(cosmosConfig, 'export');
    await fs.writeFile(
      path.join(exportPath, 'cosmos.fixtures.json'),
      JSON.stringify(json, null, 2)
    );
  },
};

function createFixtureItems(
  cosmosConfig: CosmosConfig,
  command: CosmosCommand
): CosmosFixturesJson {
  const rendererUrl = pickRendererUrl(cosmosConfig.rendererUrl, command);
  if (!rendererUrl) {
    return {
      rendererUrl: null,
      fixtures: [],
    };
  }

  const { fixturesDir, fixtureFileSuffix } = cosmosConfig;
  const { fixturePaths } = findUserModulePaths(cosmosConfig);

  return {
    rendererUrl,
    fixtures: fixturePaths.map(filePath => {
      const relPath = importKeyPath(filePath, cosmosConfig.rootDir);
      const fixtureId = { path: relPath };
      return {
        filePath: relPath,
        cleanPath: cleanFixturePath(relPath, fixturesDir, fixtureFileSuffix),
        rendererUrl: createRendererUrl(rendererUrl, fixtureId, true),
      };
    }),
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
