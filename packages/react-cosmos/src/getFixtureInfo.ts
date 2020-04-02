import path from 'path';
import {
  createFixtureTree,
  flattenFixtureTree
} from 'react-cosmos-shared2/fixtureTree';
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
  cleanPath: string[];
  filePath: string;
  playgroundUrl: string;
  rendererUrl: string;
};

export function getFixtureInfo({ cosmosConfig }: Args) {
  const { fixturesDir, fixtureFileSuffix, rootDir } = cosmosConfig;
  const host = getPlaygroundHost(cosmosConfig);

  const fixtureInfo: FixtureInfo[] = [];
  const { fixtureExportsByPath } = getUserModules(cosmosConfig);
  const fixtureNamesByPath = getFixtureNamesByPath(fixtureExportsByPath);
  const fixtureTree = createFixtureTree({
    fixtures: fixtureNamesByPath,
    fixturesDir,
    fixtureFileSuffix
  });
  const flatFixtureTree = flattenFixtureTree(fixtureTree);
  flatFixtureTree.forEach(({ fixtureId, cleanPath }) => {
    fixtureInfo.push({
      cleanPath,
      filePath: path.join(rootDir, fixtureId.path),
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
