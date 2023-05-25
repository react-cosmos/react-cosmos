import { mapValues } from 'lodash-es';
import path from 'path';
import { ReactElement } from 'react';
import {
  buildPlaygroundQueryString,
  ByPath,
  CosmosCommand,
  createFixtureTree,
  createRendererUrl,
  FixtureId,
  flattenFixtureTree,
  getFixtureFromExport,
  getFixtureListFromExports,
  getSortedDecoratorsForFixturePath,
  pickRendererUrl,
  ReactDecorator,
  ReactFixture,
  ReactFixtureExport,
} from 'react-cosmos-core';
import { createFixtureNode, decorateFixture } from 'react-cosmos-renderer';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { getPluginConfigs } from '../cosmosPlugin/pluginConfigs.js';
import { CosmosPlatform } from '../cosmosPlugin/types.js';
import { applyServerConfigPlugins } from '../shared/applyServerConfigPlugins.js';
import { getServerPlugins } from '../shared/getServerPlugins.js';
import { getPlaygroundUrl } from '../shared/playgroundUrl.js';
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
  command?: CosmosCommand;
  platform?: CosmosPlatform;
};
export async function getFixtures(
  cosmosConfig: CosmosConfig,
  { command = 'dev', platform = 'web' }: Options = {}
) {
  const pluginConfigs = await getPluginConfigs({
    cosmosConfig,
    relativePaths: false,
  });

  const serverPlugins = await getServerPlugins(
    pluginConfigs,
    cosmosConfig.rootDir
  );

  cosmosConfig = await applyServerConfigPlugins({
    cosmosConfig,
    serverPlugins,
    command,
    platform,
  });

  const { fixtures, decorators } = await importUserModules(cosmosConfig);
  const fixtureExports = mapValues(fixtures, f => f.default);
  const decoratorExports = mapValues(decorators, f => f.default);
  const rendererUrl = pickRendererUrl(cosmosConfig.rendererUrl, command);
  const result: FixtureApi[] = [];

  getFlatFixtureTree(cosmosConfig, fixtureExports).forEach(
    ({ fileName, fixtureId, name, parents }) => {
      const fixtureExport = fixtures[fixtureId.path].default;
      const fixture = getFixtureFromExport(fixtureExport, fixtureId.name);

      if (!fixture) {
        throw new Error(`Could not read fixture: ${JSON.stringify(fixtureId)}`);
      }

      const treePath = [...parents, fileName];
      if (name) treePath.push(name);

      result.push({
        absoluteFilePath: path.join(cosmosConfig.rootDir, fixtureId.path),
        fileName,
        getElement: createFixtureElementGetter(
          fixture,
          fixtureId.path,
          decoratorExports
        ),
        name,
        parents,
        playgroundUrl: getPlaygroundFixtureUrl(cosmosConfig, fixtureId),
        relativeFilePath: fixtureId.path,
        rendererUrl: rendererUrl && createRendererUrl(rendererUrl, fixtureId),
        treePath,
      });
    }
  );

  return result;
}

function getFlatFixtureTree(
  cosmosConfig: CosmosConfig,
  fixtures: ByPath<ReactFixtureExport>
) {
  const { fixturesDir, fixtureFileSuffix } = cosmosConfig;
  return flattenFixtureTree(
    createFixtureTree({
      fixtures: getFixtureListFromExports(fixtures),
      fixturesDir,
      fixtureFileSuffix,
    })
  );
}

function getPlaygroundFixtureUrl(
  cosmosConfig: CosmosConfig,
  fixtureId: FixtureId
) {
  const baseUrl = getPlaygroundUrl(cosmosConfig);
  const query = buildPlaygroundQueryString({ fixtureId });
  return `${baseUrl}/${query}`;
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
  return () => decorateFixture(createFixtureNode(fixture), decorators);
}
