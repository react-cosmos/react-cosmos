import webpack from 'webpack';
// NOTE: Mock files need to imported before modules that use the mocked APIs
import { mockCliArgs, unmockCliArgs } from '../../../../testHelpers/mockYargs';
import { getCwdPath } from '../../../../testHelpers/cwd';
import { mockConsole } from '../../../../testHelpers/mockConsole';
import { mockFile } from '../../../../testHelpers/mockFs';
import { createCosmosConfig } from '../../../../config';
import { RENDERER_FILENAME } from '../../../../shared/playgroundHtml';
import { HtmlWebpackPlugin } from './../htmlPlugin';
import { getExportWebpackConfig } from '..';

beforeAll(() => {
  // Prevent Cosmos from interceptisng the --config arg passed to Jest
  mockCliArgs({});
  mockFile('mywebpack.config.js', {
    module: { rules: [MY_RULE] },
    plugins: [MY_PLUGIN]
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
    const cosmosConfig = createCosmosConfig({
      webpack: {
        configPath: 'mywebpack.config.js'
      }
    });
    return getExportWebpackConfig(cosmosConfig, webpack);
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
  expect(entry).toContain(require.resolve('../../client'));
});

it('includes DOM devtooks hook entry', async () => {
  const { entry } = await getCustomExportWebpackConfig();
  expect(entry).toContain(
    require.resolve('../../../../domRenderer/reactDevtoolsHook')
  );
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
      publicPath: '/'
    })
  );
});

it('includes user deps loader', async () => {
  const { module } = await getCustomExportWebpackConfig();
  expect(module!.rules).toContainEqual({
    loader: require.resolve('../userDepsLoader'),
    include: require.resolve('../../client/userDeps')
  });
});

it('includes HtmlWebpackPlugin', async () => {
  const { plugins } = await getCustomExportWebpackConfig();
  const htmlWebpackPlugin = plugins!.find(
    p => p.constructor.name === 'HtmlWebpackPlugin'
  ) as HtmlWebpackPlugin;
  expect(htmlWebpackPlugin).toBeDefined();
  expect(htmlWebpackPlugin.options.filename).toBe(RENDERER_FILENAME);
});

it('does not include HotModuleReplacementPlugin', async () => {
  const { plugins } = await getCustomExportWebpackConfig();
  const hotModuleReplacementPlugin = plugins!.find(
    p => p.constructor.name === 'HotModuleReplacementPlugin'
  );
  expect(hotModuleReplacementPlugin).not.toBeDefined();
});
