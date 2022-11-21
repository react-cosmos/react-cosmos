// Webpack doesn't support ESM loaders:
// https://github.com/webpack/webpack/issues/13233
// To circumvent this we use this CJS source file that's manually copied in the
// dist folder as part of the build process
module.exports = async function injectUserDeps() {
  const server = await import('react-cosmos/server.js');
  const { createDomCosmosConfig } = await import(
    '../cosmosConfig/createDomCosmosConfig.js'
  );

  const cosmosConfig = await server.detectCosmosConfig();

  // This ensures this loader is invalidated whenever a new file is added to or
  // removed from user's project, which in turn triggers react-cosmos-voyager2
  // to detect fixture files and finally update fixture list inside Playground.
  // Note that while this may not be very performant, it's not the equivalent
  // of require.context, which not only watches for file changes but also
  // automatically bundles new files that match the watcher's query.
  // https://github.com/webpack/webpack/issues/222#issuecomment-40691546
  const watchDirs = cosmosConfig.watchDirs;
  watchDirs.forEach(watchDir => this.addContextDependency(watchDir));

  const { containerQuerySelector } = createDomCosmosConfig(cosmosConfig);
  const rendererConfig = { containerQuerySelector };
  return server.generateUserDepsModule({
    cosmosConfig,
    rendererConfig,
    relativeToDir: null,
  });
};
