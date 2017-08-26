import getDefaultWebpackConfig from '../default-webpack-config';
import { __setMocks as __setResolveMocks } from 'resolve-from';
import { __setMocks as __setImportMocks } from 'import-from';

jest.mock('resolve-from');
jest.mock('import-from');

describe('loaders', () => {
  test('module.loaders is empty when no user loaders are present', () => {
    __setResolveMocks({});
    const config = getDefaultWebpackConfig('/foo/path');

    expect(config.module.loaders).toEqual([]);
  });

  describe('includes babel-loader', () => {
    __setResolveMocks({
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
    __setResolveMocks({
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
    __setResolveMocks({
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
    __setResolveMocks({
      'json-loader': '/json/path'
    });
    const config = getDefaultWebpackConfig('/foo/path');
    expect(config.module.loaders).toContainEqual({
      test: /\.json$/,
      loader: '/foo/path/json/path',
      exclude: /node_modules/
    });
  });
});

describe('plugins', () => {
  test('plugins is empty when no user plugin is present', () => {
    __setResolveMocks({});
    const config = getDefaultWebpackConfig('/foo/path');

    expect(config.plugins).toEqual([]);
  });

  test('HtmlWebpackPlugin is added to plugins when user has it installed', () => {
    const HtmlWebpackPluginMock = jest.fn(() => ({
      id: '__html_plugin_mock__'
    }));
    __setImportMocks({
      'html-webpack-plugin': HtmlWebpackPluginMock
    });
    const config = getDefaultWebpackConfig('/foo/path');

    expect(HtmlWebpackPluginMock).toHaveBeenCalledWith({
      title: 'React Cosmos'
    });
    expect(config.plugins).toContainEqual({
      id: '__html_plugin_mock__'
    });
  });
});
