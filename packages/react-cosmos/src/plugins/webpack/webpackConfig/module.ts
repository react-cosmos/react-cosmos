// Get "default" export from either an ES or CJS module
// More context: https://github.com/react-cosmos/react-cosmos/issues/895
export function getDefaultExport(module: any | { default: any }) {
  if (typeof module === 'object' && module.default) {
    return module.default;
  }

  return module;
}
