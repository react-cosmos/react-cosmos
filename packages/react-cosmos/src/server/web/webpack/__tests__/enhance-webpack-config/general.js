import webpack from 'webpack';
import enhanceWebpackConfig from '../../enhance-webpack-config';

const mockRootPath = __dirname;

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    rootPath: mockRootPath,
    globalImports: ['./global.css'],
    publicUrl: '/static/',
    containerQuerySelector: '__mock__containerQuerySelector'
  })
}));

const plugins = [{}, {}];
const getConfig = () =>
  enhanceWebpackConfig({
    webpack,
    userWebpackConfig: { plugins }
  });

beforeEach(() => {
  jest.clearAllMocks();
});

it('adds resolved global imports to entries', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig.entry).toContain('./global.css');
});

it('adds loader entry last', () => {
  const webpackConfig = getConfig();
  const cosmosEntry = webpackConfig.entry[webpackConfig.entry.length - 1];
  expect(cosmosEntry).toBe(
    require.resolve('../../../../../client/loader-entry')
  );
});

it('keeps user plugins', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig.plugins).toContain(plugins[0]);
  expect(webpackConfig.plugins).toContain(plugins[1]);
});

it('defines global process.env.NODE_ENV as "development"', () => {
  const webpackConfig = getConfig();
  expect(
    getDefinePlugins(webpackConfig).filter(
      p =>
        p.definitions['process.env'] &&
        p.definitions['process.env'].NODE_ENV === JSON.stringify('development')
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

it('creates proper output', () => {
  const webpackConfig = getConfig();
  expect(typeof webpackConfig.output.devtoolModuleFilenameTemplate).toBe(
    'function'
  );
  expect(webpackConfig.output).toMatchObject({
    path: '/',
    filename: '[name].js',
    publicPath: '/static/'
  });
});

function getDefinePlugins({ plugins }) {
  return plugins.filter(
    p => p.constructor && p.constructor.name === 'DefinePlugin'
  );
}
