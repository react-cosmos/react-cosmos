import { getFixtureNamesByPath } from 'react-cosmos-shared2/react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import {
  stringifyPlaygroundUrlQuery,
  stringifyRendererUrlQuery
} from 'react-cosmos-shared2/url';
import { CosmosConfig } from './config';
import { RENDERER_FILENAME } from './shared/playgroundHtml';
import { getUserModules } from './shared/userDeps';

type Args = {
  cosmosConfig: CosmosConfig;
  fullScreen?: boolean;
};

export const getFixtureUrls = async (args: Args) => getFixtureUrlsSync(args);

export function getFixtureUrlsSync({ cosmosConfig, fullScreen = false }: Args) {
  const host = getPlaygroundHost(cosmosConfig);
  const fixtureUrls: string[] = [];

  function pushFixtureUrl(fixtureId: FixtureId) {
    fixtureUrls.push(createFixtureUrl(host, fixtureId, fullScreen));
  }

  const { fixtureExportsByPath } = getUserModules(cosmosConfig);
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
  if (fullScreen) {
    const query = stringifyRendererUrlQuery({ _fixtureId: fixtureId });
    return `${host}/${RENDERER_FILENAME}?${query}`;
  }

  const query = stringifyPlaygroundUrlQuery({ fixtureId });
  return `${host}/?${query}`;
}

function getPlaygroundHost({ hostname, port }: CosmosConfig) {
  return `${hostname || 'localhost'}:${port}`;
}
