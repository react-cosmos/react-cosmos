jest.mock('../utils/requireModule.js', () => {
  function requireModule(moduleId: string) {
    return require(moduleId);
  }

  function requireFrom(fromDirectory: string, moduleId: string) {
    return require(require.resolve(moduleId, { paths: [fromDirectory] }));
  }

  return {
    requireModule,
    requireFrom,
  };
});

export {};
