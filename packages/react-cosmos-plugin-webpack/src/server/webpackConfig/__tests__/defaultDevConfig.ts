// NOTE: Mock files need to imported before modules that use the mocked APIs
import { mockConsole, unmockCliArgs } from 'react-cosmos/jest.js';
import '../../testHelpers/mockEsmClientPath.js';
import '../../testHelpers/mockEsmLoaderPath.js';
import '../../testHelpers/mockEsmRequire.js';
import '../../testHelpers/mockEsmResolve.js';

import { createCosmosConfig, RENDERER_FILENAME } from 'react-cosmos';
import webpack from 'webpack';
import { getDevWebpackConfig } from '../getDevWebpackConfig.js';
import { HtmlWebpackPlugin } from '../htmlPlugin.js';

afterAll(() => {
  unmockCliArgs();
});

async function getDefaultDevWebpackConfig() {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using default webpack config');
    expectLog(
      '[Cosmos] Learn how to override webpack config for cosmos: https://github.com/react-cosmos/react-cosmos/tree/main/docs#webpack-config-override'
    );
    const cosmosConfig = createCosmosConfig(process.cwd());
    return await getDevWebpackConfig(cosmosConfig, webpack);
  });
}

it('includes client entry', async () => {
  const { entry } = await getDefaultDevWebpackConfig();
  expect(entry).toContain(require.resolve('../../../client'));
});

it('includes DOM devtooks hook entry', async () => {
  const { entry } = await getDefaultDevWebpackConfig();
  expect(entry).toContain(require.resolve('../../../client/reactDevtoolsHook'));
});

it('includes webpack-hot-middleware entry', async () => {
  const { entry } = await getDefaultDevWebpackConfig();
  expect(entry).toContain(
    `${require.resolve(
      'webpack-hot-middleware/client'
    )}?reload=false&overlay=false`
  );
});

it('create output', async () => {
  const { output } = await getDefaultDevWebpackConfig();
  expect(output).toEqual(
    expect.objectContaining({
      filename: '[name].js',
      publicPath: '/',
    })
  );
});

it('includes user deps loader', async () => {
  const { module } = await getDefaultDevWebpackConfig();
  expect(module!.rules).toContainEqual({
    loader: require.resolve('../userDepsLoader'),
    include: require.resolve('../../../client/userDeps'),
  });
});

it('includes HtmlWebpackPlugin', async () => {
  const { plugins } = await getDefaultDevWebpackConfig();
  const htmlWebpackPlugin = plugins!.find(
    p => p.constructor.name === 'HtmlWebpackPlugin'
  ) as HtmlWebpackPlugin;
  expect(htmlWebpackPlugin).toBeDefined();
  expect(htmlWebpackPlugin.userOptions).toEqual(
    expect.objectContaining({ filename: RENDERER_FILENAME })
  );
});

it('includes HotModuleReplacementPlugin', async () => {
  const { plugins } = await getDefaultDevWebpackConfig();
  const hotModuleReplacementPlugin = plugins!.find(
    p => p.constructor.name === 'HotModuleReplacementPlugin'
  );
  expect(hotModuleReplacementPlugin).toBeDefined();
});

it('sets experiments.topLevelAwait to true', async () => {
  const { experiments } = await getDefaultDevWebpackConfig();
  expect(experiments?.topLevelAwait).toBe(true);
});
