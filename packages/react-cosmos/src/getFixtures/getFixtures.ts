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
  pickRendererUrl,
  ReactDecorator,
  ReactFixture,
} from 'react-cosmos-core';
import { createFixtureNode, decorateFixture } from 'react-cosmos-renderer';
import { CosmosConfig } from '../cosmosConfig/types.js';
import { getPluginConfigs } from '../cosmosPlugin/pluginConfigs.js';
import { applyServerConfigPlugins } from '../shared/applyServerConfigPlugins.js';
import { getServerPlugins } from '../shared/getServerPlugins.js';
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

type Args = {
  cosmosConfig: CosmosConfig;
};
export async function getFixtures(args: Args) {
  let cosmosConfig = args.cosmosConfig;

  const pluginConfigs = await getPluginConfigs({
    cosmosConfig,
    // Absolute paths are required in dev mode because the dev server could
    // run in a monorepo package that's not the root of the project and plugins
    // could be installed in the root
    relativePaths: false,
  });

  const serverPlugins = await getServerPlugins({ cosmosConfig, pluginConfigs });
  cosmosConfig = await applyServerConfigPlugins({
    cosmosConfig,
    serverPlugins,
    command: 'dev',
    platform: 'web',
  });

  const { fixturesDir, fixtureFileSuffix, rootDir } = cosmosConfig;
  const rendererUrl = pickRendererUrl(cosmosConfig.rendererUrl, 'dev');

  const fixtureInfo: FixtureApi[] = [];
  const { fixtures, decorators } = importUserModules(cosmosConfig);
  const fixtureList = getFixtureListFromExports(fixtures);
  const fixtureTree = createFixtureTree({
    fixtures: fixtureList,
    fixturesDir,
    fixtureFileSuffix,
  });
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
      rendererUrl: rendererUrl && createRendererUrl(rendererUrl, fixtureId),
      treePath,
    });
  });

  return fixtureInfo;
}

function getPlaygroundUrl(cosmosConfig: CosmosConfig, fixtureId: FixtureId) {
  const host = getPlaygroundHost(cosmosConfig);
  const query = buildPlaygroundQueryString({ fixtureId });
  return `${host}/${query}`;
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
