import webpack from 'webpack';
// NOTE: Mock files need to imported before modules that use the mocked APIs
import { unmockCliArgs } from '../../../../testHelpers/mockYargs';
import { getCwdPath } from '../../../../testHelpers/cwd';
import { mockConsole } from '../../../../testHelpers/mockConsole';
import { createCosmosConfig } from '../../../../config';
import { RENDERER_FILENAME } from '../../../../shared/playgroundHtml';
import { HtmlWebpackPlugin } from '../htmlPlugin';
import { getExportWebpackConfig } from '..';

afterAll(() => {
  unmockCliArgs();
});

async function getDefaultExportWebpackConfig() {
  return mockConsole(async ({ expectLog }) => {
    expectLog('[Cosmos] Using default webpack config');
    const cosmosConfig = createCosmosConfig(process.cwd());
    return getExportWebpackConfig(cosmosConfig, webpack);
  });
}

it('includes client entry', async () => {
  const { entry } = await getDefaultExportWebpackConfig();
  expect(entry).toContain(require.resolve('../../client'));
});

it('includes DOM devtooks hook entry', async () => {
  const { entry } = await getDefaultExportWebpackConfig();
  expect(entry).toContain(require.resolve('../../client/reactDevtoolsHook'));
});

it('does not include webpack-hot-middleware entry', async () => {
  const { entry } = await getDefaultExportWebpackConfig();
  expect(entry).not.toContain(
    `${require.resolve(
      '@skidding/webpack-hot-middleware/client'
    )}?reload=true&overlay=false`
  );
});

it('create output', async () => {
  const { output } = await getDefaultExportWebpackConfig();
  expect(output).toEqual(
    expect.objectContaining({
      filename: '[name].js',
      path: getCwdPath('cosmos-export/'),
      publicPath: '/'
    })
  );
});

it('includes user deps loader', async () => {
  const { module } = await getDefaultExportWebpackConfig();
  expect(module!.rules).toContainEqual({
    loader: require.resolve('../userDepsLoader'),
    include: require.resolve('../../client/userDeps')
  });
});

it('includes HtmlWebpackPlugin', async () => {
  const { plugins } = await getDefaultExportWebpackConfig();
  const htmlWebpackPlugin = plugins!.find(
    p => p.constructor.name === 'HtmlWebpackPlugin'
  ) as HtmlWebpackPlugin;
  expect(htmlWebpackPlugin).toBeDefined();
  expect(htmlWebpackPlugin.options.filename).toBe(RENDERER_FILENAME);
});

it('does not include HotModuleReplacementPlugin', async () => {
  const { plugins } = await getDefaultExportWebpackConfig();
  const hotModuleReplacementPlugin = plugins!.find(
    p => p.constructor.name === 'HotModuleReplacementPlugin'
  );
  expect(hotModuleReplacementPlugin).not.toBeDefined();
});
