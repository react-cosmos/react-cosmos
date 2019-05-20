import webpack from 'webpack';
// NOTE: Mock files need to imported before modules that use the mocked APIs
import { unmockCliArgs, mockCliArgs } from '../../../../testHelpers/mockYargs';
import { mockConsole } from '../../../../testHelpers/mockConsole';
import { mockFile } from '../../../../testHelpers/mockFs';
import { createCosmosConfig } from '../../../../config';
import { RENDERER_FILENAME } from '../../../../shared/playgroundHtml';
import { HtmlWebpackPlugin } from '../htmlPlugin';
import { getDevWebpackConfig } from '..';

const mockWebpackConfig = jest.fn(() => ({
  module: { rules: [MY_RULE] },
  plugins: [MY_PLUGIN]
}));

const mockWebpackOverride = jest.fn((webpackConfig: webpack.Configuration) => ({
  ...webpackConfig,
  plugins: [...(webpackConfig.plugins || []), MY_PLUGIN2]
}));

beforeAll(() => {
  mockWebpackConfig.mockClear();
  mockCliArgs({ env: { prod: true }, fooEnvVar: true });
  mockFile('mywebpack.config.js', mockWebpackConfig);
  mockFile('mywebpack.override.js', mockWebpackOverride);
});

afterAll(() => {
  unmockCliArgs();
});

const MY_RULE = {};
const MY_PLUGIN = {};
const MY_PLUGIN2 = {};

async function getCustomDevWebpackConfig() {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using webpack config found at mywebpack.config.js');
    const cosmosConfig = createCosmosConfig({
      webpack: {
        configPath: 'mywebpack.config.js',
        overridePath: 'mywebpack.override.js'
      }
    });
    return getDevWebpackConfig(cosmosConfig, webpack);
  });
}

it('calls webpack config function with correct args', async () => {
  await getCustomDevWebpackConfig();
  const [env, argv] = mockWebpackConfig.mock.calls[0] as any[];
  expect(env.prod).toBe(true);
  expect(argv.fooEnvVar).toBe(true);
});

it('includes user rule', async () => {
  const { module } = await getCustomDevWebpackConfig();
  expect(module!.rules).toContain(MY_RULE);
});

it('includes plugin from user config', async () => {
  const { plugins } = await getCustomDevWebpackConfig();
  expect(plugins).toContain(MY_PLUGIN);
});

it('calls override function with env', async () => {
  await getCustomDevWebpackConfig();
  expect(mockWebpackOverride).toBeCalledWith(expect.any(Object), 'development');
});

it('includes plugin from user override', async () => {
  const { plugins } = await getCustomDevWebpackConfig();
  expect(plugins).toContain(MY_PLUGIN2);
});

it('includes client entry', async () => {
  const { entry } = await getCustomDevWebpackConfig();
  expect(entry).toContain(require.resolve('../../client'));
});

it('includes DOM devtooks hook entry', async () => {
  const { entry } = await getCustomDevWebpackConfig();
  expect(entry).toContain(
    require.resolve('../../../../domRenderer/reactDevtoolsHook')
  );
});

it('includes webpack-hot-middleware entry', async () => {
  const { entry } = await getCustomDevWebpackConfig();
  expect(entry).toContain(
    `${require.resolve(
      'webpack-hot-middleware/client'
    )}?reload=true&overlay=false`
  );
});

it('create output', async () => {
  const { output } = await getCustomDevWebpackConfig();
  expect(output).toEqual(
    expect.objectContaining({
      filename: '[name].js',
      path: '/',
      publicPath: '/'
    })
  );
});

it('includes user deps loader', async () => {
  const { module } = await getCustomDevWebpackConfig();
  expect(module!.rules).toContainEqual({
    loader: require.resolve('../userDepsLoader'),
    include: require.resolve('../../client/userDeps')
  });
});

it('includes HtmlWebpackPlugin', async () => {
  const { plugins } = await getCustomDevWebpackConfig();
  const htmlWebpackPlugin = plugins!.find(
    p => p.constructor.name === 'HtmlWebpackPlugin'
  ) as HtmlWebpackPlugin;
  expect(htmlWebpackPlugin).toBeDefined();
  expect(htmlWebpackPlugin.options.filename).toBe(RENDERER_FILENAME);
});

it('includes HotModuleReplacementPlugin', async () => {
  const { plugins } = await getCustomDevWebpackConfig();
  const hotModuleReplacementPlugin = plugins!.find(
    p => p.constructor.name === 'HotModuleReplacementPlugin'
  );
  expect(hotModuleReplacementPlugin).toBeDefined();
});
