import path from 'path';
import { ReactElement } from 'react';
import {
  buildPlaygroundQueryString,
  buildRendererQueryString,
  ByPath,
  createFixtureTree,
  FixtureId,
  flattenFixtureTree,
  getFixtureFromExport,
  getFixtureListFromExports,
  getSortedDecoratorsForFixturePath,
  ReactDecorator,
  ReactFixture,
} from 'react-cosmos-core';
import { createFixtureNode, decorateFixture } from 'react-cosmos-renderer';
import { coreServerPlugins } from '../corePlugins/index.js';
import { detectCosmosConfig } from '../cosmosConfig/detectCosmosConfig.js';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { getPluginConfigs } from '../cosmosPlugin/pluginConfigs.js';
import { CosmosCommand, CosmosPlatform } from '../cosmosPlugin/types.js';
import { importServerPlugins } from '../shared/importServerPlugins.js';
import { importUserModules } from '../userModules/importUserModules.js';

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

export async function getFixtures(options: Options = {}) {
  const initCosmosConfig = await detectCosmosConfig();
  const cosmosConfig = await applyPlugins(initCosmosConfig, options);

  const { fixtures, decorators } = importUserModules(cosmosConfig);

  const fixtureTree = createFixtureTree({
    fixtures: getFixtureListFromExports(fixtures),
    fixturesDir: cosmosConfig.fixturesDir,
    fixtureFileSuffix: cosmosConfig.fixtureFileSuffix,
  });

  const fixtureInfo: FixtureApi[] = [];

  const flatFixtureTree = flattenFixtureTree(fixtureTree);
  flatFixtureTree.forEach(({ fileName, fixtureId, name, parents }) => {
    const fixtureExport = fixtures[fixtureId.path];
    const fixture = getFixtureFromExport(fixtureExport, fixtureId.name);

    if (!fixture) {
      throw new Error(`Could not read fixture: ${JSON.stringify(fixtureId)}`);
    }

    const treePath = [...parents, fileName];
    if (name) treePath.push(name);

    fixtureInfo.push({
      absoluteFilePath: path.join(cosmosConfig.rootDir, fixtureId.path),
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

async function applyPlugins(
  initCosmosConfig: CosmosConfig,
  { command = 'dev', platform = 'web' }: Options
) {
  let cosmosConfig = initCosmosConfig;

  const pluginConfigs = await getPluginConfigs({
    cosmosConfig,
    relativePaths: command === 'export',
  });

  const userPlugins = await importServerPlugins(
    pluginConfigs,
    cosmosConfig.rootDir
  );
  const plugins = [...coreServerPlugins, ...userPlugins];

  for (const plugin of plugins) {
    if (plugin.config) {
      try {
        cosmosConfig = await plugin.config({
          cosmosConfig,
          command,
          platform,
        });
      } catch (err) {
        console.log(`[Cosmos][plugin:${plugin.name}] Config hook failed`);
        throw err;
      }
    }
  }

  return cosmosConfig;
}

function getPlaygroundUrl(cosmosConfig: CosmosConfig, fixtureId: FixtureId) {
  const host = getPlaygroundHost(cosmosConfig);
  const query = buildPlaygroundQueryString({ fixtureId });
  return `${host}/${query}`;
}

function getRendererUrl(cosmosConfig: CosmosConfig, fixtureId: FixtureId) {
  const { rendererUrl } = cosmosConfig;
  const query = buildRendererQueryString({ fixtureId });
  return rendererUrl ? rendererUrl + query : null;
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
  return () => decorateFixture(createFixtureNode(fixture), decorators);
}
