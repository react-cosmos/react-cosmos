import path from 'path';
import { getDecoratedFixtureElement } from 'react-cosmos-shared2/FixtureLoader';
import {
  createFixtureTree,
  flattenFixtureTree,
  removeFixtureNameExtension,
  removeFixtureNameSuffix,
} from 'react-cosmos-shared2/fixtureTree';
import {
  getFixtureNamesByPath,
  getSortedDecoratorsForFixturePath,
  ReactDecorator,
  ReactDecoratorsByPath,
  ReactFixture,
  ReactFixtureMap,
} from 'react-cosmos-shared2/react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import {
  stringifyPlaygroundUrlQuery,
  stringifyRendererUrlQuery,
} from 'react-cosmos-shared2/url';
import url from 'url';
import { CosmosConfig } from './config';
import { RENDERER_FILENAME } from './shared/playgroundHtml';
import { getUserModules } from './shared/userDeps';

export type FixtureApi = {
  absoluteFilePath: string;
  fileName: string;
  getElement: () => React.ReactElement<any>;
  name: string | null;
  playgroundUrl: string;
  relativeFilePath: string;
  rendererUrl: string;
  treePath: string[];
};

export function getFixtures2(cosmosConfig: CosmosConfig) {
  const { fixturesDir, fixtureFileSuffix, rootDir } = cosmosConfig;

  const fixtureInfo: FixtureApi[] = [];
  const { fixtureExportsByPath, decoratorsByPath } = getUserModules(
    cosmosConfig
  );
  const fixtureNamesByPath = getFixtureNamesByPath(fixtureExportsByPath);
  const fixtureTree = createFixtureTree({
    fixtures: fixtureNamesByPath,
    fixturesDir,
    fixtureFileSuffix,
  });
  const flatFixtureTree = flattenFixtureTree(fixtureTree);
  flatFixtureTree.forEach(({ fixtureId, cleanPath }) => {
    const rawFileName = fixtureId.path.split('/').pop()!;
    const cleanFileName = removeFixtureNameSuffix(
      removeFixtureNameExtension(rawFileName),
      fixtureFileSuffix
    );
    const fixtureExport = fixtureExportsByPath[fixtureId.path];
    const fixture: ReactFixture =
      fixtureId.name === null
        ? fixtureExport
        : (fixtureExport as ReactFixtureMap)[fixtureId.name];
    fixtureInfo.push({
      absoluteFilePath: path.join(rootDir, fixtureId.path),
      fileName: cleanFileName,
      getElement: createFixtureElementGetter(
        fixture,
        fixtureId.path,
        decoratorsByPath
      ),
      name: fixtureId.name,
      playgroundUrl: getPlaygroundUrl(cosmosConfig, fixtureId),
      relativeFilePath: fixtureId.path,
      rendererUrl: getRendererUrl(cosmosConfig, fixtureId),
      treePath: cleanPath,
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
  const { publicUrl } = cosmosConfig;
  const host = getPlaygroundHost(cosmosConfig);
  const urlPath = url.resolve(publicUrl, RENDERER_FILENAME);
  const query = stringifyRendererUrlQuery({ _fixtureId: fixtureId });
  return `${host}${urlPath}?${query}`;
}

function getPlaygroundHost({ hostname, port }: CosmosConfig) {
  return `http://${hostname || 'localhost'}:${port}`;
}

function createFixtureElementGetter(
  fixture: ReactFixture,
  fixturePath: string,
  decoratorsByPath: ReactDecoratorsByPath
): () => React.ReactElement<any> {
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
