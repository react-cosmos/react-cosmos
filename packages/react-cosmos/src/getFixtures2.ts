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
import { CosmosConfig } from './config';
import { RENDERER_FILENAME } from './shared/playgroundHtml';
import { getUserModules } from './shared/userDeps';

type Args = {
  cosmosConfig: CosmosConfig;
  nameFormatter?: (fixtureId: FixtureId) => string;
};

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

export function getFixtures2({ cosmosConfig }: Args) {
  const { fixturesDir, fixtureFileSuffix, rootDir } = cosmosConfig;
  const host = getPlaygroundHost(cosmosConfig);

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
      playgroundUrl: getPlaygroundUrl(host, fixtureId),
      relativeFilePath: fixtureId.path,
      rendererUrl: getRendererUrl(host, fixtureId),
      treePath: cleanPath,
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
