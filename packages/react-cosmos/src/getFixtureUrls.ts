import { getFixtureNamesByPath } from 'react-cosmos-shared2/react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import {
  PlaygroundUrlParams,
  stringifyPlaygroundUrlQuery
} from 'react-cosmos-shared2/url';
import { CosmosConfig } from './config';
import { getUserModules } from './shared/userDeps';

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

  const { fixtureExportsByPath } = await getUserModules(cosmosConfig);
  const fixtureNamesByPath = getFixtureNamesByPath(fixtureExportsByPath);
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
