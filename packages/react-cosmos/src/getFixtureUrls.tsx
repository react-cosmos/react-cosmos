import path from 'path';
import {
  getFixtureNamesByPath,
  ReactFixtureExportsByPath
} from 'react-cosmos-shared2/react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import {
  PlaygroundUrlParams,
  stringifyPlaygroundUrlQuery
} from 'react-cosmos-shared2/url';
import { CosmosConfig } from './config';
import { slash } from './shared/slash';
import { findUserModulePaths } from './shared/userDeps';

type Args = {
  cosmosConfig: CosmosConfig;
  fullScreen?: boolean;
};

export async function getFixtureUrls({
  cosmosConfig,
  fullScreen = false
}: Args) {
  const host = getPlaygroundHost(cosmosConfig);
  const fixtureUrls: string[] = [];

  function pushFixtureUrl(fixtureId: FixtureId) {
    fixtureUrls.push(createFixtureUrl(host, fixtureId, fullScreen));
  }

  const fixtureExportsByPath = await getFixtureExportsByPath(cosmosConfig);
  const fixtureNamesByPath = await getFixtureNamesByPath(fixtureExportsByPath);
  Object.keys(fixtureNamesByPath).forEach(fixturePath => {
    const fixtureNames = fixtureNamesByPath[fixturePath];
    if (fixtureNames === null) {
      pushFixtureUrl({ path: fixturePath, name: null });
    } else {
      fixtureNames.forEach(fixtureName => {
        pushFixtureUrl({ path: fixturePath, name: fixtureName });
      });
    }
  });

  return fixtureUrls;
}

function createFixtureUrl(
  host: string,
  fixtureId: FixtureId,
  fullScreen: boolean
) {
  const urlParams: PlaygroundUrlParams = { fixtureId };
  if (fullScreen) {
    urlParams.fullScreen = true;
  }

  return `${host}/?${stringifyPlaygroundUrlQuery(urlParams)}`;
}

function getPlaygroundHost({ hostname, port }: CosmosConfig) {
  return `${hostname || 'localhost'}:${port}`;
}

async function getFixtureExportsByPath({
  rootDir,
  fixturesDir,
  fixtureFileSuffix
}: CosmosConfig): Promise<ReactFixtureExportsByPath> {
  const { fixturePaths } = await findUserModulePaths({
    rootDir,
    fixturesDir,
    fixtureFileSuffix
  });

  const reactFixturesByPath: ReactFixtureExportsByPath = {};
  fixturePaths.forEach(fixturePath => {
    const relPath = slash(path.relative(rootDir, fixturePath));
    reactFixturesByPath[relPath] = require(fixturePath).default;
  });

  return reactFixturesByPath;
}
