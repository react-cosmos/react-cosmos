import getDefaultWebpackConfig from '../../default-webpack-config';

jest.mock('resolve-from', () => ({
  silent: (rootPath, loaderName) => {
    const mocks = {
      'babel-loader': '/babel/path'
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

it('includes babel-loader for src', () => {
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.module.rules).toContainEqual({
    exclude: /node_modules/,
    loader: '/babel/path',
    test: /\.jsx?$/
  });
});

it('includes babel-loader for react-cosmos-flow', () => {
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.module.rules).toContainEqual({
    include: /react-cosmos-flow/,
    loader: '/babel/path',
    test: /\.js$/
  });
});
