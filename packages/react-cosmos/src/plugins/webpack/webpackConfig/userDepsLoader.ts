import { DomRendererConfig } from '../../../shared/rendererConfig';
import { generateUserDepsModule } from '../../../shared/userDeps';
import { detectCosmosConfig } from '../../../config';
import { createDomCosmosConfig } from '../cosmosConfig/dom';

type WebpackLoaderContext = {
  async(): (error: Error | null, result: string | Buffer) => unknown;
  addContextDependency(directory: string): unknown;
};

module.exports = async function injectUserDeps(source: string) {
  const cosmosConfig = detectCosmosConfig();
  const webpackLoaderContext = (this as any) as WebpackLoaderContext;
  const callback = webpackLoaderContext.async();

  // This ensures this loader is invalidated whenever a new file is added to or
  // removed from user's project, which in turn triggers react-cosmos-voyager2
  // to detect fixture files and finally update fixture list inside Playground.
  // Note that while this may not be very performant, it's not the equivalent
  // of require.context, which not only watches for file changes but also
  // automatically bundles new files that match the watcher's query.
  // https://github.com/webpack/webpack/issues/222#issuecomment-40691546
  const watchDirs = cosmosConfig.watchDirs;
  watchDirs.forEach(watchDir =>
    webpackLoaderContext.addContextDependency(watchDir)
  );

  const { containerQuerySelector } = createDomCosmosConfig(cosmosConfig);
  const rendererConfig: DomRendererConfig = { containerQuerySelector };
  const userDepsModule = await generateUserDepsModule(
    cosmosConfig,
    rendererConfig
  );
  callback(null, userDepsModule);
};
