// Webpack doesn't support ESM loaders:
// https://github.com/webpack/webpack/issues/13233
// To circumvent this we use this CJS source file that's manually copied in the
// dist folder as part of the build process
module.exports = async function injectUserImports() {
  const cosmos = await import('react-cosmos');
  const { config, mode } = this.getOptions();

  // This ensures this loader is invalidated whenever a new file is added to or
  // removed from user's project, which in turn triggers findUserModulePaths
  // to detect fixture files and finally update fixture list inside Playground.
  // Note that while this may not be very performant, it's not the equivalent
  // of require.context, which not only watches for file changes but also
  // automatically bundles new files that match the watcher's query.
  // https://github.com/webpack/webpack/issues/222#issuecomment-40691546
  const watchDirs = config.watchDirs;
  watchDirs.forEach(watchDir => this.addContextDependency(watchDir));

  const { containerQuerySelector } = config.dom;
  const modulePaths = await cosmos.findUserModulePaths(config);
  const rendererConfig = {
    webSocketUrl: mode === 'dev' ? cosmos.getWebSocketUrl(config) : null,
    rendererUrl: null,
    containerQuerySelector,
  };
  return cosmos.generateUserImports({
    config,
    modulePaths,
    rendererConfig,
    relativeToDir: null,
    typeScript: false,
  });
};
