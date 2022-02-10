// NOTE: Mock files need to imported before modules that use the mocked APIs
import { mockConsole } from '../../../../testHelpers/mockConsole';
import { mockFile } from '../../../../testHelpers/mockFs';

import webpack from 'webpack';
import { createCosmosConfig } from '../../../../config';
import { getDevWebpackConfig } from '../getDevWebpackConfig';

async function getCustomDevWebpackConfig() {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using webpack config found at mywebpack.config.js');
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
  mockFile('mywebpack.config.js', () => ({
    resolve: {
      plugins: [new ModuleScopePlugin()],
    },
  }));

  const { resolve } = await getCustomDevWebpackConfig();
  expect(resolve!.plugins).toEqual([]);
});

it('keeps other resolve plugins', async () => {
  mockFile('mywebpack.config.js', () => ({
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
