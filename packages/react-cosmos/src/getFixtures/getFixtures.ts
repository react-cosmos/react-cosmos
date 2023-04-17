import path from 'path';
import { ReactElement } from 'react';
import {
  ByPath,
  createFixtureTree,
  FixtureId,
  flattenFixtureTree,
  getDecoratedFixtureElement,
  getFixtureListFromExports,
  getSortedDecoratorsForFixturePath,
  ReactDecorator,
  ReactFixture,
  ReactFixtureMap,
  stringifyPlaygroundUrlQuery,
  stringifyRendererUrlQuery,
} from 'react-cosmos-core';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { RENDERER_FILENAME } from '../shared/playgroundHtml.js';
import { resolveRendererUrl } from '../shared/resolveRendererUrl.js';
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
  const { publicUrl, rendererUrl } = cosmosConfig;
  const query = stringifyRendererUrlQuery({ _fixtureId: fixtureId });
  if (rendererUrl) return `${rendererUrl}?${query}`;

  const host = getPlaygroundHost(cosmosConfig);
  const urlPath = resolveRendererUrl(publicUrl, RENDERER_FILENAME);
  return new URL(`${urlPath}?${query}`, host).toString();
}

function getPlaygroundHost({ hostname, port, https }: CosmosConfig) {
  return `${https ? 'https' : 'http'}://${hostname || 'localhost'}:${port}`;
}

function createFixtureElementGetter(
  fixture: ReactFixture,
  fixturePath: string,
  decoratorsByPath: ByPath<ReactDecorator>
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
