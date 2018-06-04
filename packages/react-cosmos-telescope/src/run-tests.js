// @flow

import { create as renderer } from 'react-test-renderer';
import createStateProxy from 'react-cosmos-state-proxy';
import { importModule } from 'react-cosmos-shared';
import { moduleExists } from 'react-cosmos-shared/server';
import { getCosmosConfig } from 'react-cosmos-config';
import { findFixtureFiles } from 'react-cosmos-voyager2/server';
import { getComponents } from 'react-cosmos-voyager2/client';
import { createContext } from 'react-cosmos-loader';

type Args = {
  cosmosConfigPath?: string
};

export async function runTests({ cosmosConfigPath }: Args = {}) {
  const cosmosConfig = getCosmosConfig(cosmosConfigPath);
  const {
    rootPath,
    proxiesPath,
    fileMatch,
    fileMatchIgnore,
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
      rootPath,
      fileMatch,
      fileMatchIgnore,
      exclude
    });
    const fixtureModules = getFixtureModules(fixtureFiles);
    const components = getComponents({ fixtureModules, fixtureFiles });

    for (let i = 0, component; i < components.length; i++) {
      component = components[i];
      for (let j = 0, fixture; j < component.fixtures.length; j++) {
        fixture = component.fixtures[j];
        const { mount, getWrapper } = createContext({
          renderer,
          proxies,
          fixture: fixture.source
        });
        await mount();

        const wrapper = getWrapper();
        if (typeof wrapper.toJSON !== 'function') {
          throw new TypeError(
            `Snapshots can't be generated because test wrapper doesn't have .toJSON method`
          );
        }

        const tree = wrapper.toJSON();
        expect(tree).toMatchSnapshot(`${component.name}:${fixture.name}`);
      }
    }
  });
}

function getFixtureModules(fixtureFiles) {
  return fixtureFiles.reduce(
    (acc, f) => ({
      ...acc,
      [f.filePath]: importModule(require(f.filePath))
    }),
    {}
  );
}
