import getDefaultWebpackConfig from '../../default-webpack-config';

jest.mock('resolve-from', () => ({
  silent: (rootPath, loaderName) => {
    const mocks = {
      'json-loader': '/json/path'
    };

    return mocks[loaderName];
  }
}));
jest.mock('import-from', () => ({
  silent: (rootPath, loaderName) => {
    const mocks = {
      webpack: {}
    };

    return mocks[loaderName];
  }
}));

it('includes json-loader', () => {
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.module.rules).toContainEqual({
    test: /\.json$/,
    loader: '/json/path',
    exclude: /node_modules/
  });
});
