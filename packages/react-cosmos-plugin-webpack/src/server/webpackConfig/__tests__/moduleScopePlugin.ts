// NOTE: Mock files need to imported before modules that use the mocked APIs
import { mockConsole, mockCwdModuleDefault } from 'react-cosmos/jest.js';
import '../../testHelpers/mockEsmClientPath.js';
import '../../testHelpers/mockEsmLoaderPath.js';
import '../../testHelpers/mockEsmRequire.js';
import '../../testHelpers/mockEsmResolve.js';

import { createCosmosConfig } from 'react-cosmos/server.js';
import webpack from 'webpack';
import { getDevWebpackConfig } from '../getDevWebpackConfig.js';

async function getCustomDevWebpackConfig() {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using webpack config found at mywebpack.config.js');
    expectLog(
      '[Cosmos] Learn how to override webpack config for cosmos: https://github.com/react-cosmos/react-cosmos/tree/main/docs#webpack-config-override'
    );
    const cosmosConfig = createCosmosConfig(process.cwd(), {
      webpack: {
        configPath: 'mywebpack.config.js',
      },
    });
    return getDevWebpackConfig(cosmosConfig, webpack);
  });
}

class FooResolvePlugin {}
class BarResolvePlugin {}
class ModuleScopePlugin {}

it('removes ModuleScopePlugin resolve plugin', async () => {
  mockCwdModuleDefault('mywebpack.config.js', () => ({
    resolve: {
      plugins: [new ModuleScopePlugin()],
    },
  }));

  const { resolve } = await getCustomDevWebpackConfig();
  expect(resolve!.plugins).toEqual([]);
});

it('keeps other resolve plugins', async () => {
  mockCwdModuleDefault('mywebpack.config.js', () => ({
    resolve: {
      plugins: [
        new ModuleScopePlugin(),
        new FooResolvePlugin(),
        new BarResolvePlugin(),
      ],
    },
  }));

  const { resolve } = await getCustomDevWebpackConfig();
  expect(resolve!.plugins).toContainEqual(expect.any(FooResolvePlugin));
  expect(resolve!.plugins).toContainEqual(expect.any(BarResolvePlugin));
  expect(resolve!.plugins).not.toContainEqual(expect.any(ModuleScopePlugin));
});
