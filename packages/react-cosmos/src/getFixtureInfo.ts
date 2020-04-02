import { flattenFixtureTree } from 'react-cosmos-playground2/src/plugins/FixtureSearch/flattenFixtureTree';
import { createFixtureTree } from 'react-cosmos-shared2/fixtureTree';
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
  cleanPath: string;
  fixtureId: FixtureId;
  playgroundUrl: string;
  rendererUrl: string;
};

// TODO: Move createFixtureTree & flattenFixtureTree to shared package
export function getFixtureInfo({ cosmosConfig }: Args) {
  const { fixturesDir, fixtureFileSuffix } = cosmosConfig;
  const host = getPlaygroundHost(cosmosConfig);

  const fixtureInfo: FixtureInfo[] = [];
  const { fixtureExportsByPath } = getUserModules(cosmosConfig);
  const fixtureNamesByPath = getFixtureNamesByPath(fixtureExportsByPath);
  const fixtureTree = createFixtureTree({
    fixtures: fixtureNamesByPath,
    fixturesDir,
    fixtureFileSuffix
  });
  const fixtureIdsByCleanPath = flattenFixtureTree(fixtureTree);
  Object.keys(fixtureIdsByCleanPath).forEach(cleanPath => {
    const fixtureId = fixtureIdsByCleanPath[cleanPath];
    fixtureInfo.push({
      cleanPath,
      fixtureId,
      playgroundUrl: getRendererUrl(host, fixtureId),
      rendererUrl: getPlaygroundUrl(host, fixtureId)
    });
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
  return `http://${hostname || 'localhost'}:${port}`;
}
