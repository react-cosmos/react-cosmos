import path from 'path';
import { ReactElement } from 'react';
import {
  createFixtureTree,
  FixtureId,
  flattenFixtureTree,
  getDecoratedFixtureElement,
  getFixtureListFromExports,
  getSortedDecoratorsForFixturePath,
  ReactDecorator,
  ReactDecorators,
  ReactFixture,
  ReactFixtureMap,
  stringifyPlaygroundUrlQuery,
  stringifyRendererUrlQuery,
} from 'react-cosmos-core';
import url from 'url';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { RENDERER_FILENAME } from '../shared/playgroundHtml.js';
import { getUserModules } from '../userDeps/getUserModules.js';

export type FixtureApi = {
  absoluteFilePath: string;
  fileName: string;
  getElement: () => ReactElement;
  name: string | null;
  parents: string[];
  playgroundUrl: string;
  relativeFilePath: string;
  rendererUrl: string;
  treePath: string[];
};

export function getFixtures(cosmosConfig: CosmosConfig) {
  const { fixturesDir, fixtureFileSuffix, rootDir } = cosmosConfig;

  const fixtureInfo: FixtureApi[] = [];
  const { fixtures, decorators } = getUserModules(cosmosConfig);
  const fixtureList = getFixtureListFromExports(fixtures);
  const fixtureTree = createFixtureTree({
    fixtures: fixtureList,
    fixturesDir,
    fixtureFileSuffix,
  });
  const flatFixtureTree = flattenFixtureTree(fixtureTree);
  flatFixtureTree.forEach(({ fileName, fixtureId, name, parents }) => {
    const fixtureExport = fixtures[fixtureId.path];
    const fixture: ReactFixture =
      fixtureId.name === undefined
        ? (fixtureExport as ReactFixture)
        : (fixtureExport as ReactFixtureMap)[fixtureId.name];

    const treePath = [...parents, fileName];
    if (name) treePath.push(name);

    fixtureInfo.push({
      absoluteFilePath: path.join(rootDir, fixtureId.path),
      fileName,
      getElement: createFixtureElementGetter(
        fixture,
        fixtureId.path,
        decorators
      ),
      name,
      parents,
      playgroundUrl: getPlaygroundUrl(cosmosConfig, fixtureId),
      relativeFilePath: fixtureId.path,
      rendererUrl: getRendererUrl(cosmosConfig, fixtureId),
      treePath,
    });
  });

  return fixtureInfo;
}

function getPlaygroundUrl(cosmosConfig: CosmosConfig, fixtureId: FixtureId) {
  const host = getPlaygroundHost(cosmosConfig);
  const query = stringifyPlaygroundUrlQuery({ fixtureId });
  return `${host}/?${query}`;
}

function getRendererUrl(cosmosConfig: CosmosConfig, fixtureId: FixtureId) {
  const { publicUrl, experimentalRendererUrl } = cosmosConfig;
  const query = stringifyRendererUrlQuery({ _fixtureId: fixtureId });
  if (experimentalRendererUrl) return `${experimentalRendererUrl}?${query}`;

  const host = getPlaygroundHost(cosmosConfig);
  const urlPath = url.resolve(publicUrl, RENDERER_FILENAME);
  return `${host}${urlPath}?${query}`;
}

function getPlaygroundHost({ hostname, port, https }: CosmosConfig) {
  return `${https ? 'https' : 'http'}://${hostname || 'localhost'}:${port}`;
}

function createFixtureElementGetter(
  fixture: ReactFixture,
  fixturePath: string,
  decoratorsByPath: ReactDecorators
): () => ReactElement {
  const decorators: ReactDecorator[] = getSortedDecoratorsForFixturePath(
    fixturePath,
    decoratorsByPath
  );
  return () =>
    getDecoratedFixtureElement(fixture, decorators, {
      fixtureState: {},
      setFixtureState: () => {},
      onErrorReset: () => {},
    });
}
