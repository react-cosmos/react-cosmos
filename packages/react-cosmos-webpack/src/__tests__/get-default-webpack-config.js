import getDefaultWebpackConfig from '../default-webpack-config';
import {
  __setMocks as __setResolveMocks,
  silent as silentResolve
} from 'resolve-from';
import {
  __setMocks as __setImportMocks,
  silent as silentImport
} from 'import-from';

jest.mock('resolve-from');
jest.mock('import-from');

describe('loaders', () => {
  test('tries to resolve suported loaders with cosmosConfigPath', () => {
    __setResolveMocks({});
    getDefaultWebpackConfig('/foo/path');

    expect(silentResolve).toHaveBeenCalledWith('/foo/path', 'babel-loader');
    expect(silentResolve).toHaveBeenCalledWith('/foo/path', 'style-loader');
    expect(silentResolve).toHaveBeenCalledWith('/foo/path', 'css-loader');
    expect(silentResolve).toHaveBeenCalledWith('/foo/path', 'json-loader');
  });

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
      loader: '/babel/path',
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
      loader: '/style/path',
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
      loader: '/style/path!/css/path',
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
      loader: '/json/path',
      exclude: /node_modules/
    });
  });
});

describe('plugins', () => {
  test('tries to import plugins with cosmosConfigPath', () => {
    __setImportMocks({});
    getDefaultWebpackConfig('/foo/path');

    expect(silentImport).toHaveBeenCalledWith(
      '/foo/path',
      'html-webpack-plugin'
    );
  });

  test('plugins is empty when no user plugin is present', () => {
    __setImportMocks({});
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
