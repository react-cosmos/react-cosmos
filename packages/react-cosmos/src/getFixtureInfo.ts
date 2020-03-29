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
  nameFormatter?: (fixtureId: FixtureId) => string;
};

type FixtureInfo = {
  fixtureId: FixtureId;
  playgroundUrl: string;
  rendererUrl: string;
};

export function getFixtureInfo({ cosmosConfig }: Args) {
  const host = getPlaygroundHost(cosmosConfig);
  const fixtureInfo: FixtureInfo[] = [];

  function pushFixtureInfo(fixtureId: FixtureId) {
    fixtureInfo.push({
      fixtureId,
      playgroundUrl: getRendererUrl(host, fixtureId),
      rendererUrl: getPlaygroundUrl(host, fixtureId)
    });
  }

  const { fixtureExportsByPath } = getUserModules(cosmosConfig);
  const fixtureNamesByPath = getFixtureNamesByPath(fixtureExportsByPath);
  Object.keys(fixtureNamesByPath).forEach(fixturePath => {
    const fixtureNames = fixtureNamesByPath[fixturePath];
    if (fixtureNames === null) {
      pushFixtureInfo({ path: fixturePath, name: null });
    } else {
      fixtureNames.forEach(fixtureName => {
        pushFixtureInfo({ path: fixturePath, name: fixtureName });
      });
    }
  });

  return fixtureInfo;
}

function getPlaygroundUrl(host: string, fixtureId: FixtureId) {
  const query = stringifyPlaygroundUrlQuery({ fixtureId });
  return `${host}/?${query}`;
}

function getRendererUrl(host: string, fixtureId: FixtureId) {
  const query = stringifyRendererUrlQuery({ _fixtureId: fixtureId });
  return `${host}/${RENDERER_FILENAME}?${query}`;
}

function getPlaygroundHost({ hostname, port }: CosmosConfig) {
  return `${hostname || 'localhost'}:${port}`;
}
