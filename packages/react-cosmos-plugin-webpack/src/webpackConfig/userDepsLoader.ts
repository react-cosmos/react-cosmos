import { DomRendererConfig } from 'react-cosmos';
import {
  detectCosmosConfig,
  generateUserDepsModule,
} from 'react-cosmos/server';
import { createDomCosmosConfig } from '../cosmosConfig/createDomCosmosConfig';

// XXX: Loader types are currently missing in webpack 5
// https://github.com/webpack/webpack/issues/11630
interface LoaderContext {
  addContextDependency(dir: string): unknown;
}

module.exports = function injectUserDeps(this: LoaderContext) {
  const cosmosConfig = detectCosmosConfig();

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
  const rendererConfig: DomRendererConfig = { containerQuerySelector };
  return generateUserDepsModule({
    cosmosConfig,
    rendererConfig,
    relativeToDir: null,
  });
};
