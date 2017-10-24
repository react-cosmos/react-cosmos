import React from 'react';
import renderer from 'react-test-renderer';
import createStateProxy from 'react-cosmos-state-proxy';
import moduleExists from 'react-cosmos-utils/lib/module-exists';
import importModule from 'react-cosmos-utils/lib/import-module';
import getCosmosConfig from 'react-cosmos-config';
import { findFixtureFiles } from 'react-cosmos-voyager2/lib/server/find-fixture-files';
import { getComponents } from 'react-cosmos-voyager2/lib/client/get-components';
import { Loader } from 'react-cosmos-loader';

export default async ({ cosmosConfigPath } = {}) => {
  const cosmosConfig = getCosmosConfig(cosmosConfigPath);
  const { componentPaths, proxiesPath } = cosmosConfig;

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
    const fixtureFiles = await findFixtureFiles(cosmosConfig);
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
