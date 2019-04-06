import { COSMOS_CONFIG, getWatchDirs } from '../../shared/config';
import { injectRendererData } from '../../shared/rendererData';

type WebpackLoaderContext = {
  async(): (error: Error | null, result: string | Buffer) => unknown;
  addContextDependency(directory: string): unknown;
};

module.exports = async function injectRendererDataLoader(source: string) {
  const cosmosConfig = COSMOS_CONFIG;
  const webpackLoaderContext = (this as any) as WebpackLoaderContext;
  const callback = webpackLoaderContext.async();

  // This ensures this loader is invalidated whenever a new file is added to or
  // removed from user's project, which in turn triggers react-cosmos-voyager2
  // to detect fixture files and finally update fixture list inside Playground.
  // Note that while this may not be very performant, it's not the equivalent
  // of require.context, which not only watches for file changes but also
  // automatically bundles new files that match the watcher's query.
  // https://github.com/webpack/webpack/issues/222#issuecomment-40691546
  const watchDirs = getWatchDirs(cosmosConfig);
  watchDirs.forEach(watchDir =>
    webpackLoaderContext.addContextDependency(watchDir)
  );

  callback(null, await injectRendererData(cosmosConfig, source));
};
