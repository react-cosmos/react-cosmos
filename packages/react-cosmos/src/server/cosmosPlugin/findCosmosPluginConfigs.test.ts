import '../testHelpers/mockEsmRequire.js';
import '../testHelpers/mockEsmResolve.js';

import path from 'path';
import { findCosmosPluginConfigs } from './findCosmosPluginConfigs.js';

// Allow plugin configs to be read without having to actually build
// the plugin packages
jest.mock('../utils/resolveSilent.js', () => {
  return {
    resolveSilent: (moduleId: string) => `${moduleId}.js`,
  };
});

it('loads mono repo plugins', () => {
  const packagesDir = path.join(__dirname, '../../../..');

  const configs = findCosmosPluginConfigs({ rootDir: packagesDir });
  expect(configs).toMatchInlineSnapshot(`
    [
      {
        "name": "Boolean input",
        "rootDir": "react-cosmos-plugin-boolean-input",
        "ui": "react-cosmos-plugin-boolean-input/dist/ui.js",
      },
      {
        "name": "Open fixture",
        "rootDir": "react-cosmos-plugin-open-fixture",
        "ui": "react-cosmos-plugin-open-fixture/dist/ui.js",
      },
      {
        "devServer": "react-cosmos-plugin-webpack/dist/server/webpackDevServerPlugin.js",
        "export": "react-cosmos-plugin-webpack/dist/server/webpackExportPlugin.js",
        "name": "React Cosmos Webpack",
        "rootDir": "react-cosmos-plugin-webpack",
        "ui": "react-cosmos-plugin-webpack/dist/ui/build.js",
      },
    ]
  `);
});
