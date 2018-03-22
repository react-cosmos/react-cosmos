import getDefaultWebpackConfig from '../../default-webpack-config';

jest.mock('resolve-from', () => ({
  silent: (rootPath, loaderName) => {
    const mocks = {
      'style-loader': '/style/path'
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

it('includes style-loader', () => {
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.module.rules).toContainEqual({
    test: /\.css$/,
    loader: '/style/path',
    exclude: /node_modules/
  });
});
