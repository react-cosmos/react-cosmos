jest.mock('../utils/resolve.js', () => {
  function resolve(moduleId: string) {
    return require.resolve(moduleId);
  }

  function resolveFrom(fromDirectory: string, moduleId: string) {
    return require.resolve(moduleId, { paths: [fromDirectory] });
  }

  return {
    resolve,
    resolveFrom,
  };
});

export {};
