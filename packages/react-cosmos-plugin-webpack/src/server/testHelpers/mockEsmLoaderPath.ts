jest.mock('../webpackConfig/resolveWebpackLoaderPath.js', () => {
  function resolveWebpackLoaderPath() {
    return require.resolve('../webpackConfig/userImportsLoader.cjs');
  }

  return { resolveWebpackLoaderPath };
});

export {};
