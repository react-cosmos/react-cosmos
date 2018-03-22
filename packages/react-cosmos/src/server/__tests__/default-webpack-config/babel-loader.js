import getDefaultWebpackConfig from '../../default-webpack-config';

jest.mock('resolve-from', () => ({
  silent: (rootPath, loaderName) => {
    const mocks = {
      'babel-loader': '/babel/path'
    };
    return mocks[loaderName];
  }
}));
jest.mock('import-from', () => ({ silent: () => {} }));

it('includes babel-loader', () => {
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.module.rules).toContainEqual({
    exclude: /node_modules/,
    loader: '/babel/path',
    test: /\.jsx?$/
  });
});
