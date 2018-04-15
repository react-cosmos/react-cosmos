import webpack from 'webpack';
import extendWebpackConfig from '../../extend-webpack-config';

const mockWebpackOverrideResult = {};
const mockWebpackOverride = jest.fn(() => mockWebpackOverrideResult);

jest.mock('react-cosmos-config', () => ({
  hasUserCosmosConfig: () => true,
  getCosmosConfig: () => ({
    globalImports: [],
    webpack: mockWebpackOverride
  })
}));

const mockRule = {};
const mockPlugin = {};

const getConfig = () =>
  extendWebpackConfig({
    webpack,
    userWebpackConfig: {
      module: {
        rules: [mockRule]
      },
      plugins: [mockPlugin]
    }
  });

it('calls webpack override method with derived config', () => {
  getConfig();
  const overrideCall = mockWebpackOverride.mock.calls[0];
  expect(overrideCall[0].module.rules).toContain(mockRule);
  expect(overrideCall[0].plugins).toContain(mockPlugin);
});

it('calls webpack override method with env', () => {
  getConfig();
  const overrideCall = mockWebpackOverride.mock.calls[0];
  expect(overrideCall[1].env).toContain(process.env.NODE_ENV);
});

it('calls returns overriden webpack config', () => {
  const webpackConfig = getConfig();
  expect(webpackConfig).toBe(mockWebpackOverrideResult);
});
