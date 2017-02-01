/* eslint-disable import/no-dynamic-require */

import renderer from 'react-test-renderer';
import getCosmosConfig from 'react-cosmos-config';
import getFilePaths from 'react-cosmos-voyager';
import { createLoaderElement } from 'react-cosmos';

const { keys } = Object;

const importFileTree = filePaths => (
  keys(filePaths).reduce((acc, name) => {
    return {
      ...acc,
      [name]: require(filePaths[name]),
    };
  }, {})
);

export default ({ cosmosConfigPath }) => {
  const cosmosConfig = getCosmosConfig(cosmosConfigPath);
  const filePaths = getFilePaths(cosmosConfig);

  const proxies = cosmosConfig.proxies.map(proxy => require(proxy));
  const components = importFileTree(filePaths.components);
  const fixtures = keys(filePaths.fixtures).reduce((acc, component) => {
    return {
      ...acc,
      [component]: importFileTree(filePaths.fixtures[component]),
    };
  }, {});

  Object.keys(fixtures).forEach(component => {
    const componentFixtures = fixtures[component];
    Object.keys(componentFixtures).forEach(fixture => {
      test(`${component}:${fixture}`, () => {
        const tree = renderer.create(
          createLoaderElement({
            components,
            fixtures,
            proxies,
            component,
            fixture,
          })
        ).toJSON();
        expect(tree).toMatchSnapshot();
      });
    });
  });
};
