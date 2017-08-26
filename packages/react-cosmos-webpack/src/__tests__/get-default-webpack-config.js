import getDefaultWebpackConfig from '../default-webpack-config';
import { __setMocks } from 'resolve-from';

jest.mock('resolve-from');

test('module.loaders is empty with no user loaders', () => {
  __setMocks({});
  const config = getDefaultWebpackConfig('/foo/path');

  expect(config.module.loaders).toEqual([]);
});

describe('includes babel-loader', () => {
  __setMocks({
    'babel-loader': '/babel/path'
  });
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.module.loaders).toContainEqual({
    exclude: /node_modules/,
    loader: '/foo/path/babel/path',
    test: /\.jsx?$/
  });
});

describe('includes style-loader', () => {
  __setMocks({
    'style-loader': '/style/path'
  });
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.module.loaders).toContainEqual({
    test: /\.css$/,
    loader: '/foo/path/style/path',
    exclude: /node_modules/
  });
});

describe('includes style-loader + css-loader', () => {
  __setMocks({
    'style-loader': '/style/path',
    'css-loader': '/css/path'
  });
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.module.loaders).toContainEqual({
    test: /\.css$/,
    loader: '/foo/path/style/path!/foo/path/css/path',
    exclude: /node_modules/
  });
});

describe('includes json-loader', () => {
  __setMocks({
    'json-loader': '/json/path'
  });
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.module.loaders).toContainEqual({
    test: /\.json$/,
    loader: '/foo/path/json/path',
    exclude: /node_modules/
  });
});
