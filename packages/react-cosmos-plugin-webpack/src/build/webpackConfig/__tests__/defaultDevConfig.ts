// NOTE: Mock files need to imported before modules that use the mocked APIs
import { mockConsole, unmockCliArgs } from 'react-cosmos/jest.js';

import { createCosmosConfig } from 'react-cosmos';
import webpack from 'webpack';
import { RENDERER_FILENAME } from '../constants.js';
import { getDevWebpackConfig } from '../getDevWebpackConfig.js';
import { HtmlWebpackPlugin } from '../htmlPlugin.js';

afterAll(() => {
  unmockCliArgs();
});

const cosmosConfig = createCosmosConfig(process.cwd());

async function getDefaultDevWebpackConfig() {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using default webpack config');
    expectLog(
      '[Cosmos] Learn how to override webpack config for cosmos: https://github.com/react-cosmos/react-cosmos/tree/main/docs#webpack-config-override'
    );
    return await getDevWebpackConfig(cosmosConfig, webpack);
  });
}

it('includes renderer entry', async () => {
  const { entry } = await getDefaultDevWebpackConfig();
  expect(entry).toContain(require.resolve('../../../renderer'));
});

it('includes DOM devtooks hook entry', async () => {
  const { entry } = await getDefaultDevWebpackConfig();
  expect(entry).toContain(
    require.resolve('../../../renderer/reactDevtoolsHook')
  );
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
      publicPath: '',
    })
  );
});

it('includes user imports loader', async () => {
  const { module } = await getDefaultDevWebpackConfig();
  expect(module!.rules).toContainEqual({
    loader: require.resolve('../userImportsLoader'),
    include: require.resolve('../../../renderer/userImports'),
    options: { cosmosConfig },
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
