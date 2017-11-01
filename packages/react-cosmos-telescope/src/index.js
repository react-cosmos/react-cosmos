// @flow

import React from 'react';
import renderer from 'react-test-renderer';
import createStateProxy from 'react-cosmos-state-proxy';
import { importModule } from 'react-cosmos-shared';
import { moduleExists } from 'react-cosmos-shared/lib/server';
import getCosmosConfig from 'react-cosmos-config';
import { findFixtureFiles } from 'react-cosmos-voyager2/lib/server';
import { getComponents } from 'react-cosmos-voyager2/lib/client';
import { Loader } from 'react-cosmos-loader';

type Args = {
  cosmosConfigPath: Array<string>
};

export default async ({ cosmosConfigPath }: Args) => {
  const cosmosConfig = getCosmosConfig(cosmosConfigPath);
  const {
    rootPath,
    proxiesPath,
    fileMatch,
    exclude,
    componentPaths
  } = cosmosConfig;

  if (componentPaths.length > 0) {
    console.warn(
      '[Cosmos] Using `componentPaths` config is deprecated.' +
        'Upgrading is required for snapshot testing.'
    );
    return;
  }

  const userProxies = moduleExists(proxiesPath)
    ? importModule(require(proxiesPath))
    : [];
  const proxies = [
    ...userProxies,
    // Loaded by default in all configs
    createStateProxy()
  ];

  test('Cosmos fixtures', async () => {
    const fixtureFiles = await findFixtureFiles({
      cwd: rootPath,
      fileMatch,
      exclude
    });
    const fixtureModules = getFixtureModules(fixtureFiles);
    const components = getComponents({ fixtureModules, fixtureFiles });

    components.forEach(component => {
      const { fixtures } = component;
      fixtures.forEach(fixture => {
        const tree = renderer
          .create(<Loader proxies={proxies} fixture={fixture.source} />)
          .toJSON();
        expect(tree).toMatchSnapshot(`${component.name}:${fixture.name}`);
      });
    });
  });
};

function getFixtureModules(fixtureFiles) {
  return fixtureFiles.reduce(
    (acc, f) => ({
      ...acc,
      [f.filePath]: importModule(require(f.filePath))
    }),
    {}
  );
}
