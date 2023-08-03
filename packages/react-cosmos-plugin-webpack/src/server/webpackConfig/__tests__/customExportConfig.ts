// NOTE: Mock files need to imported before modules that use the mocked APIs
import {
  mockConsole,
  mockCwdModuleDefault,
  unmockCliArgs,
} from 'react-cosmos/jest.js';

import { createCosmosConfig, getCwdPath } from 'react-cosmos';
import webpack from 'webpack';
import { RENDERER_FILENAME } from '../constants.js';
import { getExportWebpackConfig } from '../getExportWebpackConfig.js';
import { HtmlWebpackPlugin } from '../htmlPlugin.js';

beforeAll(() => {
  mockCwdModuleDefault('mywebpack.config.js', {
    module: { rules: [MY_RULE] },
    plugins: [MY_PLUGIN],
  });
});

afterAll(() => {
  unmockCliArgs();
});

const MY_RULE = {};
const MY_PLUGIN = {};

const cosmosConfig = createCosmosConfig(process.cwd(), {
  webpack: {
    configPath: 'mywebpack.config.js',
  },
});

async function getCustomExportWebpackConfig() {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using webpack config found at mywebpack.config.js');
    expectLog(
      '[Cosmos] Learn how to override webpack config for cosmos: https://github.com/react-cosmos/react-cosmos/tree/main/docs#webpack-config-override'
    );
    return await getExportWebpackConfig(cosmosConfig, webpack);
  });
}

it('includes user rule', async () => {
  const { module } = await getCustomExportWebpackConfig();
  expect(module!.rules).toContain(MY_RULE);
});

it('includes user plugin', async () => {
  const { plugins } = await getCustomExportWebpackConfig();
  expect(plugins).toContain(MY_PLUGIN);
});

it('includes client entry', async () => {
  const { entry } = await getCustomExportWebpackConfig();
  expect(entry).toContain(require.resolve('../../../client'));
});

it('includes DOM devtooks hook entry', async () => {
  const { entry } = await getCustomExportWebpackConfig();
  expect(entry).toContain(require.resolve('../../../client/reactDevtoolsHook'));
});

it('does not include webpack-hot-middleware entry', async () => {
  const { entry } = await getCustomExportWebpackConfig();
  expect(entry).not.toContain(
    `${require.resolve(
      'webpack-hot-middleware/client'
    )}?reload=true&overlay=false`
  );
});

it('create output', async () => {
  const { output } = await getCustomExportWebpackConfig();
  expect(output).toEqual(
    expect.objectContaining({
      filename: '[name].js',
      path: getCwdPath('cosmos-export/'),
      publicPath: '',
    })
  );
});

it('includes user imports loader', async () => {
  const { module } = await getCustomExportWebpackConfig();
  expect(module!.rules).toContainEqual({
    loader: require.resolve('../userImportsLoader'),
    include: require.resolve('../../../client/userImports'),
    options: { cosmosConfig },
  });
});

it('includes HtmlWebpackPlugin', async () => {
  const { plugins = [] } = await getCustomExportWebpackConfig();
  const htmlWebpackPlugin = plugins.find(
    p => p && p.constructor.name === 'HtmlWebpackPlugin'
  ) as HtmlWebpackPlugin;
  expect(htmlWebpackPlugin).toBeDefined();
  expect(htmlWebpackPlugin.userOptions).toEqual(
    expect.objectContaining({ filename: RENDERER_FILENAME })
  );
});

it('does not include HotModuleReplacementPlugin', async () => {
  const { plugins = [] } = await getCustomExportWebpackConfig();
  const hotModuleReplacementPlugin = plugins.find(
    p => p && p.constructor.name === 'HotModuleReplacementPlugin'
  );
  expect(hotModuleReplacementPlugin).not.toBeDefined();
});

it('sets experiments.topLevelAwait to true', async () => {
  const { experiments } = await getCustomExportWebpackConfig();
  expect(experiments?.topLevelAwait).toBe(true);
});
