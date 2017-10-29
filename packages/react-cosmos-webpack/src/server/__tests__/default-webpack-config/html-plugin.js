import getDefaultWebpackConfig from '../../default-webpack-config';

jest.mock('resolve-from', () => ({ silent: () => {} }));
jest.mock('import-from', () => ({
  silent: (rootPath, pluginName) => {
    const HtmlWebpackPluginMock = jest.fn(() => ({
      id: '__html_plugin_mock__'
    }));
    const mocks = {
      'html-webpack-plugin': HtmlWebpackPluginMock
    };
    return mocks[pluginName];
  }
}));

it('includes HtmlWebpackPlugin', () => {
  const config = getDefaultWebpackConfig('/foo/path');
  expect(config.plugins).toContainEqual({
    id: '__html_plugin_mock__'
  });
});
