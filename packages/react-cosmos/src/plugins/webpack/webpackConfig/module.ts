// Better than fs.existsSync because it works for paths without an extension
export function moduleExists(modulePath: string) {
  try {
    return modulePath && require.resolve(modulePath) && true;
  } catch (err) {
    return false;
  }
}

// Get "default" export from either an ES or CJS module
// More context: https://github.com/react-cosmos/react-cosmos/issues/895
export function getDefaultExport(module: { default?: {} }) {
  if (typeof module === 'object' && 'default' in module) {
    return module.default;
  }

  return module;
}
