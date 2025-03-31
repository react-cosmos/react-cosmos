// NOTE: Mock files need to imported before modules that use the mocked APIs
import { mockConsole, unmockCliArgs } from 'react-cosmos/vitest.js';

import { createCosmosConfig, getCwdPath } from 'react-cosmos';
import webpack from 'webpack';
import { pkgPath } from '../../../testHelpers/pkgPath.js';
import { RENDERER_FILENAME } from '../constants.js';
import { getExportWebpackConfig } from '../getExportWebpackConfig.js';
import { HtmlWebpackPlugin } from '../htmlPlugin.js';

afterAll(async () => {
  await unmockCliArgs();
});

const cosmosConfig = createCosmosConfig(process.cwd());

async function getDefaultExportWebpackConfig() {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using default webpack config');
    expectLog(
      '[Cosmos] Learn how to override webpack config for cosmos: https://reactcosmos.org/docs/getting-started/webpack#webpack-config-override'
    );
    return await getExportWebpackConfig(cosmosConfig, webpack);
  });
}

it('includes client entry', async () => {
  const { entry } = await getDefaultExportWebpackConfig();
  expect(entry).toContain(pkgPath('client/index.js'));
});

it('includes DOM devtooks hook entry', async () => {
  const { entry } = await getDefaultExportWebpackConfig();
  expect(entry).toContain(pkgPath('client/reactDevtoolsHook.js'));
});

it('does not include webpack-hot-middleware entry', async () => {
  const { entry } = await getDefaultExportWebpackConfig();
  expect(entry).not.toContain(
    `${require.resolve(
      'webpack-hot-middleware/client'
    )}?reload=true&overlay=false`
  );
});

it('create output', async () => {
  const { output } = await getDefaultExportWebpackConfig();
  expect(output).toEqual(
    expect.objectContaining({
      filename: '[name].js',
      path: getCwdPath('cosmos-export/'),
      publicPath: '',
    })
  );
});

it('includes user imports loader', async () => {
  const { module } = await getDefaultExportWebpackConfig();
  expect(module!.rules).toContainEqual({
    loader: pkgPath('server/webpackConfig/userImportsLoader.cjs'),
    include: pkgPath('client/userImports.js'),
    options: { cosmosConfig, cosmosCommand: 'export' },
  });
});

it('includes HtmlWebpackPlugin', async () => {
  const { plugins = [] } = await getDefaultExportWebpackConfig();
  const htmlWebpackPlugin = plugins.find(
    p => p && p.constructor.name === 'HtmlWebpackPlugin'
  ) as HtmlWebpackPlugin;
  expect(htmlWebpackPlugin).toBeDefined();
  expect(htmlWebpackPlugin.userOptions).toEqual(
    expect.objectContaining({ filename: RENDERER_FILENAME })
  );
});

it('does not include HotModuleReplacementPlugin', async () => {
  const { plugins = [] } = await getDefaultExportWebpackConfig();
  const hotModuleReplacementPlugin = plugins.find(
    p => p && p.constructor.name === 'HotModuleReplacementPlugin'
  );
  expect(hotModuleReplacementPlugin).not.toBeDefined();
});

it('sets experiments.topLevelAwait to true', async () => {
  const { experiments } = await getDefaultExportWebpackConfig();
  expect(experiments?.topLevelAwait).toBe(true);
});
