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
  plugins: [MY_PLUGIN],
}));

const mockWebpackOverride = jest.fn((webpackConfig: webpack.Configuration) => ({
  ...webpackConfig,
  plugins: [...(webpackConfig.plugins || []), MY_PLUGIN2],
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
    const cosmosConfig = createCosmosConfig(process.cwd(), {
      webpack: {
        configPath: 'mywebpack.config.js',
        overridePath: 'mywebpack.override.js',
      },
    });
    return await getDevWebpackConfig(cosmosConfig, webpack);
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
  expect(entry).toContain(require.resolve('../../client/reactDevtoolsHook'));
});

it('includes webpack-hot-middleware entry', async () => {
  const { entry } = await getCustomDevWebpackConfig();
  expect(entry).toContain(
    `${require.resolve(
      '@skidding/webpack-hot-middleware/client'
    )}?reload=true&overlay=false`
  );
});

it('create output', async () => {
  const { output } = await getCustomDevWebpackConfig();
  expect(output).toEqual(
    expect.objectContaining({
      filename: '[name].js',
      publicPath: '/',
    })
  );
});

it('includes user deps loader', async () => {
  const { module } = await getCustomDevWebpackConfig();
  expect(module!.rules).toContainEqual({
    loader: require.resolve('../userDepsLoader'),
    include: require.resolve('../../client/userDeps'),
  });
});

it('includes HtmlWebpackPlugin', async () => {
  const { plugins } = await getCustomDevWebpackConfig();
  const htmlWebpackPlugin = plugins!.find(
    p => p.constructor.name === 'HtmlWebpackPlugin'
  ) as HtmlWebpackPlugin;
  expect(htmlWebpackPlugin).toBeDefined();
  expect(htmlWebpackPlugin.userOptions).toEqual(
    expect.objectContaining({ filename: RENDERER_FILENAME })
  );
});

it('includes HotModuleReplacementPlugin', async () => {
  const { plugins } = await getCustomDevWebpackConfig();
  const hotModuleReplacementPlugin = plugins!.find(
    p => p.constructor.name === 'HotModuleReplacementPlugin'
  );
  expect(hotModuleReplacementPlugin).toBeDefined();
});

it('applies resolve aliases for React', async () => {
  const resolvePreact = jest.fn(() => ({
    ...mockWebpackConfig(),
    resolve: {
      alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat',
      },
    },
  }));
  mockFile('mywebpack.config.js', resolvePreact);

  const { resolve } = await getCustomDevWebpackConfig();
  expect(resolve?.alias).toBeDefined();
  const aliasAsObject = resolve?.alias as Record<
    string,
    string | false | string[]
  >;
  expect(aliasAsObject.react).toEqual('preact/compat');
  expect(aliasAsObject['react-dom']).toEqual('preact/compat');
});

it('applies resolve aliases for React using exact matches', async () => {
  const resolvePreact = jest.fn(() => ({
    ...mockWebpackConfig(),
    resolve: {
      alias: {
        react$: 'preact/compat',
        'react-dom$': 'preact/compat',
      },
    },
  }));
  mockFile('mywebpack.config.js', resolvePreact);

  const { resolve } = await getCustomDevWebpackConfig();
  expect(resolve?.alias).toBeDefined();
  const aliasAsObject = resolve?.alias as Record<
    string,
    string | false | string[]
  >;
  expect(aliasAsObject.react$).toEqual('preact/compat');
  expect(aliasAsObject.react).toBeUndefined();
  expect(aliasAsObject['react-dom$']).toEqual('preact/compat');
  expect(aliasAsObject['react-dom']).toBeUndefined();
});

it('applies resolve aliases for React using array form', async () => {
  const resolvePreact = jest.fn(() => ({
    ...mockWebpackConfig(),
    resolve: {
      alias: [
        {
          name: 'react',
          alias: 'preact/compat',
        },
        {
          name: 'react-dom$',
          alias: 'preact/compat',
        },
      ],
    },
  }));
  mockFile('mywebpack.config.js', resolvePreact);

  const { resolve } = await getCustomDevWebpackConfig();
  expect(resolve?.alias).toBeDefined();
  const aliasAsArray = resolve?.alias as Array<{
    name: string;
    alias: string | false | string[];
  }>;
  expect(aliasAsArray).toHaveLength(2);
  expect(aliasAsArray).toContainEqual({
    name: 'react',
    alias: 'preact/compat',
  });
  expect(aliasAsArray).toContainEqual({
    name: 'react-dom$',
    alias: 'preact/compat',
  });
});

it('adds missing React aliases by matching the alias form', async () => {
  const resolvePreact = jest.fn(() => ({
    ...mockWebpackConfig(),
    resolve: {
      alias: [
        {
          name: 'xyz',
          alias: 'abc',
        },
      ],
    },
  }));
  mockFile('mywebpack.config.js', resolvePreact);

  const { resolve } = await getCustomDevWebpackConfig();
  expect(resolve?.alias).toBeDefined();
  const aliasAsArray = resolve?.alias as Array<{
    name: string;
    alias: string | false | string[];
  }>;
  expect(aliasAsArray).toHaveLength(3);
  expect(aliasAsArray).toEqual(
    expect.arrayContaining([
      {
        name: 'xyz',
        alias: 'abc',
      },
      {
        name: 'react',
        alias: expect.stringMatching(/node_modules\/react$/),
      },
      {
        name: 'react-dom',
        alias: expect.stringMatching(/node_modules\/react-dom$/),
      },
    ])
  );
});
