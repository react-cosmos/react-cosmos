import webpack from 'webpack';
import extendWebpackConfig from '../../extend-webpack-config';

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    globalImports: ['./global.css'],
    publicUrl: '/loader/',
    hot: true,
    outputPath: '__mock__outputPath',
    containerQuerySelector: '__mock__containerQuerySelector'
  })
}));

const getConfig = () =>
  extendWebpackConfig({
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
    path: '__mock__outputPath/loader/',
    filename: '[name].js',
    publicPath: '/loader/'
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
        p.definitions['process.env'].PUBLIC_URL === JSON.stringify('/loader/')
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
