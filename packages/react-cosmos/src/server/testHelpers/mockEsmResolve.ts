jest.mock('../utils/resolve.js', () => {
  let resolveMocks: { [moduleId: string]: string } = {};

  function resolve(moduleId: string) {
    if (resolveMocks.hasOwnProperty(moduleId)) return resolveMocks[moduleId];

    return require.resolve(moduleId);
  }

  function resolveFrom(fromDirectory: string, moduleId: string) {
    return require.resolve(moduleId, { paths: [fromDirectory] });
  }

  return {
    resolve,
    resolveFrom,

    __mockResolve: (moduleId: string, mockPath: string) => {
      resolveMocks = { ...resolveMocks, [moduleId]: mockPath };
    },

    __resetMock() {
      resolveMocks = {};
    },
  };
});

export function mockResolve(moduleId: string, mockPath: string) {
  requireMocked().__mockResolve(moduleId, mockPath);
}

export function resetResolveMock() {
  requireMocked().__resetMock();
}

function requireMocked() {
  return require('../utils/resolve.js');
}
