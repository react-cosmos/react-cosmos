// NOTE: Mock files need to imported before modules that use the mocked APIs
import { mockConsole, mockFile, unmockCliArgs } from 'react-cosmos/jest';

import {
  createCosmosConfig,
  getCwdPath,
  RENDERER_FILENAME,
} from 'react-cosmos/server.js';
import webpack from 'webpack';
import { getExportWebpackConfig } from '../getExportWebpackConfig.js';
import { HtmlWebpackPlugin } from '../htmlPlugin.js';

beforeAll(() => {
  mockFile('mywebpack.config.js', {
    module: { rules: [MY_RULE] },
    plugins: [MY_PLUGIN],
  });
});

afterAll(() => {
  unmockCliArgs();
});

const MY_RULE = {};
const MY_PLUGIN = {};

async function getCustomExportWebpackConfig() {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using webpack config found at mywebpack.config.js');
    const cosmosConfig = createCosmosConfig(process.cwd(), {
      webpack: {
        configPath: 'mywebpack.config.js',
      },
    });
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
      '@skidding/webpack-hot-middleware/client'
    )}?reload=true&overlay=false`
  );
});

it('create output', async () => {
  const { output } = await getCustomExportWebpackConfig();
  expect(output).toEqual(
    expect.objectContaining({
      filename: '[name].js',
      path: getCwdPath('cosmos-export/'),
      publicPath: '/',
    })
  );
});

it('includes user deps loader', async () => {
  const { module } = await getCustomExportWebpackConfig();
  expect(module!.rules).toContainEqual({
    loader: require.resolve('../userDepsLoader'),
    include: require.resolve('../../../client/userDeps'),
  });
});

it('includes HtmlWebpackPlugin', async () => {
  const { plugins } = await getCustomExportWebpackConfig();
  const htmlWebpackPlugin = plugins!.find(
    p => p.constructor.name === 'HtmlWebpackPlugin'
  ) as HtmlWebpackPlugin;
  expect(htmlWebpackPlugin).toBeDefined();
  expect(htmlWebpackPlugin.userOptions).toEqual(
    expect.objectContaining({ filename: RENDERER_FILENAME })
  );
});

it('does not include HotModuleReplacementPlugin', async () => {
  const { plugins } = await getCustomExportWebpackConfig();
  const hotModuleReplacementPlugin = plugins!.find(
    p => p.constructor.name === 'HotModuleReplacementPlugin'
  );
  expect(hotModuleReplacementPlugin).not.toBeDefined();
});
