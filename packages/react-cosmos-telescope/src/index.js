import React from 'react';
import renderer from 'react-test-renderer';
import createStateProxy from 'react-cosmos-state-proxy';
import moduleExists from 'react-cosmos-utils/lib/module-exists';
import importModule from 'react-cosmos-utils/lib/import-module';
import getCosmosConfig from 'react-cosmos-config';
import getFilePaths from 'react-cosmos-voyager';
import { Loader } from 'react-cosmos-loader';

const { keys } = Object;

const importFileTree = filePaths =>
  keys(filePaths).reduce((acc, name) => {
    return {
      ...acc,
      [name]: importModule(require(filePaths[name]))
    };
  }, {});

export default ({ cosmosConfigPath } = {}) => {
  const cosmosConfig = getCosmosConfig(cosmosConfigPath);
  const filePaths = getFilePaths(cosmosConfig);
  const { proxiesPath } = cosmosConfig;

  const proxies = moduleExists(proxiesPath)
    ? importModule(require(proxiesPath))
    : [];
  const components = importFileTree(filePaths.components);
  const fixtures = keys(filePaths.fixtures).reduce((acc, component) => {
    return {
      ...acc,
      [component]: importFileTree(filePaths.fixtures[component])
    };
  }, {});

  keys(fixtures).forEach(component => {
    const componentFixtures = fixtures[component];
    keys(componentFixtures).forEach(fixture => {
      test(`${component}:${fixture}`, () => {
        const tree = renderer
          .create(
            <Loader
              proxies={[
                ...proxies,
                // Loaded by default in all configs
                createStateProxy()
              ]}
              component={components[component]}
              fixture={componentFixtures[fixture]}
            />
          )
          .toJSON();
        expect(tree).toMatchSnapshot();
      });
    });
  });
};
