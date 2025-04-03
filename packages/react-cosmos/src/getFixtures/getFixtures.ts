import { mapValues } from 'lodash-es';
import path from 'path';
import { ReactElement } from 'react';
import {
  buildPlaygroundQueryString,
  ByPath,
  createFixtureTree,
  createRendererUrl,
  FixtureId,
  flattenFixtureTree,
  getFixtureFromExport,
  getFixtureListFromExports,
  getSortedDecoratorsForFixturePath,
  ReactDecorator,
  ReactFixture,
  ReactFixtureExport,
} from 'react-cosmos-core';
import { createFixtureNode, decorateFixture } from 'react-cosmos-renderer';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { getPlaygroundUrls } from '../shared/playgroundUrl.js';
import { importUserModules } from './importUserModules.js';

export type FixtureApi = {
  absoluteFilePath: string;
  fileName: string;
  getElement: () => ReactElement;
  name: string | null;
  parents: string[];
  playgroundUrl: string;
  relativeFilePath: string;
  rendererUrl: string | null;
  treePath: string[];
};

type Options = {
  rendererUrl?: string;
};
export async function getFixtures(config: CosmosConfig, options: Options = {}) {
  const { fixtures, decorators } = await importUserModules(config);
  const fixtureExports = mapValues(fixtures, f => f.default);
  const decoratorExports = mapValues(decorators, f => f.default);
  const result: FixtureApi[] = [];

  getFlatFixtureTree(config, fixtureExports).forEach(
    ({ fileName, fixtureId, name, parents }) => {
      const fixtureExport = fixtures[fixtureId.path].default;
      const fixtureOptions = fixtures[fixtureId.path].options ?? {};
      const fixture = getFixtureFromExport(fixtureExport, fixtureId.name);

      if (!fixture) {
        throw new Error(`Could not read fixture: ${JSON.stringify(fixtureId)}`);
      }

      const treePath = [...parents, fileName];
      if (name) treePath.push(name);

      result.push({
        absoluteFilePath: path.join(config.rootDir, fixtureId.path),
        fileName,
        getElement: createFixtureElementGetter(
          fixture,
          fixtureOptions,
          fixtureId.path,
          decoratorExports
        ),
        name,
        parents,
        playgroundUrl: getPlaygroundFixtureUrl(config, fixtureId),
        relativeFilePath: fixtureId.path,
        rendererUrl: options.rendererUrl
          ? createRendererUrl(options.rendererUrl, fixtureId)
          : null,
        treePath,
      });
    }
  );

  return result;
}

function getFlatFixtureTree(
  config: CosmosConfig,
  fixtures: ByPath<ReactFixtureExport>
) {
  const { fixturesDir, fixtureFileSuffix } = config;
  return flattenFixtureTree(
    createFixtureTree({
      fixtures: getFixtureListFromExports(fixtures),
      fixturesDir,
      fixtureFileSuffix,
    })
  );
}

function getPlaygroundFixtureUrl(config: CosmosConfig, fixtureId: FixtureId) {
  const [baseUrl] = getPlaygroundUrls(config);
  const query = buildPlaygroundQueryString({ fixture: fixtureId });
  return `${baseUrl}/${query}`;
}

function createFixtureElementGetter(
  fixture: ReactFixture,
  fixtureOptions: {},
  fixturePath: string,
  decoratorsByPath: ByPath<ReactDecorator | ReactDecorator[]>
): () => ReactElement {
  const decorators = getSortedDecoratorsForFixturePath(
    fixturePath,
    decoratorsByPath
  );
  return () =>
    decorateFixture(
      createFixtureNode(fixture),
      fixtureOptions,
      decorators.flat()
    );
}
