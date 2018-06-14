import getDefaultWebpackConfig from '../../default-webpack-config';

const mockHtmlWebpackPlugin = jest.fn(() => ({
  id: '__html_plugin_mock__'
}));

jest.mock('resolve-from', () => ({ silent: () => {} }));
jest.mock('import-from', () => ({
  silent: (rootPath, pluginName) => {
    const mocks = {
      webpack: {},
      'html-webpack-plugin': mockHtmlWebpackPlugin
    };
    return mocks[pluginName];
  }
}));

it('sets _loader.html filename', () => {
  getDefaultWebpackConfig('/foo/path');
  expect(mockHtmlWebpackPlugin.mock.calls[0][0].filename).toBe('_loader.html');
});

it('includes HtmlWebpackPlugin', () => {
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.plugins).toContainEqual({
    id: '__html_plugin_mock__'
  });
});
