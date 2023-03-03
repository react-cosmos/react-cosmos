jest.mock('../webpackConfig/resolveWebpackClientPath.js', () => {
  function resolveWebpackClientPath(relPath: string) {
    return require.resolve(`../../client/${relPath}`);
  }

  return { resolveWebpackClientPath };
});

export {};
