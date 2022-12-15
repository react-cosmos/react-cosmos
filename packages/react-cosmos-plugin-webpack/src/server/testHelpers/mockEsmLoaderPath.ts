jest.mock('../webpackConfig/resolveWebpackLoaderPath.js', () => {
  function resolveWebpackLoaderPath() {
    return require.resolve('../webpackConfig/userDepsLoader.cjs');
  }

  return { resolveWebpackLoaderPath };
});

export {};
