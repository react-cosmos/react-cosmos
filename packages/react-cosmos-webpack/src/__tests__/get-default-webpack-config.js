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
    'babel-loader': '/foo/babel/path'
  });
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.module.loaders).toContainEqual({
    exclude: /node_modules/,
    loader: '/foo/babel/path',
    test: /\.jsx?$/
  });
});

describe('includes style-loader', () => {
  __setMocks({
    'style-loader': '/foo/style/path'
  });
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.module.loaders).toContainEqual({
    test: /\.css$/,
    loader: '/foo/style/path',
    exclude: /node_modules/
  });
});

describe('includes style-loader + css-loader', () => {
  __setMocks({
    'style-loader': '/foo/style/path',
    'css-loader': '/foo/css/path'
  });
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.module.loaders).toContainEqual({
    test: /\.css$/,
    loader: '/foo/style/path!/foo/css/path',
    exclude: /node_modules/
  });
});
