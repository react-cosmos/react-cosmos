jest.mock('../shared/staticPath.js', () => {
  function getStaticPath(relPath: string) {
    return require.resolve(`../static/${relPath}`);
  }

  return { getStaticPath };
});

export {};
