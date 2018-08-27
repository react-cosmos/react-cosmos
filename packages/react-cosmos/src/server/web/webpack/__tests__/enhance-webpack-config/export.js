import { join } from 'path';
import webpack from 'webpack';
import enhanceWebpackConfig from '../../enhance-webpack-config';

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    globalImports: ['./global.css'],
    publicUrl: '/static/',
    hot: true,
    outputPath: '__mock__outputPath',
    containerQuerySelector: '__mock__containerQuerySelector'
  })
}));

const getConfig = () =>
  enhanceWebpackConfig({
    webpack,
    userWebpackConfig: {},
    shouldExport: true
  });

beforeEach(() => {
  jest.clearAllMocks();
});

it('creates proper output', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig.output).toMatchObject({
    path: join('__mock__outputPath', '/static/'),
    filename: '[name].js',
    publicPath: '/static/'
  });
});

it('does not add hot middleware client to entries', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig.entry).not.toContain(
    `${require.resolve('webpack-hot-middleware/client')}?reload=true`
  );
});

it('defines global process.env.NODE_ENV as "production"', () => {
  const webpackConfig = getConfig();
  expect(
    getDefinePlugins(webpackConfig).filter(
      p =>
        p.definitions['process.env'] &&
        p.definitions['process.env'].NODE_ENV === JSON.stringify('production')
    )
  ).toHaveLength(1);
});

it('defines global process.env.PUBLIC_URL', () => {
  const webpackConfig = getConfig();
  expect(
    getDefinePlugins(webpackConfig).filter(
      p =>
        p.definitions['process.env'] &&
        p.definitions['process.env'].PUBLIC_URL === JSON.stringify('/static')
    )
  ).toHaveLength(1);
});

it('defines global COSMOS_CONFIG', () => {
  const webpackConfig = getConfig();
  expect(
    getDefinePlugins(webpackConfig).filter(
      p =>
        p.definitions.COSMOS_CONFIG ===
        JSON.stringify({
          containerQuerySelector: '__mock__containerQuerySelector'
        })
    )
  ).toHaveLength(1);
});

function getDefinePlugins({ plugins }) {
  return plugins.filter(
    p => p.constructor && p.constructor.name === 'DefinePlugin'
  );
}
