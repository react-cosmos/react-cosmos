// @flow

import { getCosmosConfig } from 'react-cosmos-config';
import { moduleExists } from 'react-cosmos-shared/server';
import getFilePaths from 'react-cosmos-voyager';
import { findFixtureFiles } from 'react-cosmos-voyager2/server';

import type { Config } from 'react-cosmos-flow/config';
import type { FixtureFile } from 'react-cosmos-flow/module';

const { keys } = Object;

/**
 * Inject require calls in bundle for each component/fixture path and
 * add entire project path as a context dependency. Tells webpack to
 * - Bundle all necessary component/fixture modules
 * - Watch for (and react to) added and changed component/fixture files
 */
module.exports = async function embedModules(source: string) {
  const callback = this.async();

  const cosmosConfig: Config = getCosmosConfig();
  const { proxiesPath, watchDirs } = cosmosConfig;

  const {
    fixtureFiles,
    deprecatedComponentModules
  } = await getNormalizedModules(cosmosConfig);
  const fixturePaths = getFixturePaths(fixtureFiles);
  const fixtureModuleCalls = convertPathsToRequireCalls(fixturePaths);
  const componentModuleCallls = convertPathsToRequireCalls(
    keys(deprecatedComponentModules).map(c => deprecatedComponentModules[c])
  );

  // This ensures this loader is invalidated whenever a new file is added to or
  // removed from user's project, which in turn triggers react-cosmos-voyager2
  // to detect fixture files and finally update fixture list inside Playground.
  // Note that while this may not be very performant, it's not the equivalent
  // of require.context, which not only watches for file changes but also
  // automatically bundles new files that match the watcher's query.
  // https://github.com/webpack/webpack/issues/222#issuecomment-40691546
  watchDirs.forEach(watchDir => this.addContextDependency(watchDir));

  const result = source
    .replace(/FIXTURE_MODULES/g, fixtureModuleCalls)
    .replace(/FIXTURE_FILES/g, JSON.stringify(fixtureFiles))
    .replace(/DEPRECATED_COMPONENT_MODULES/g, componentModuleCallls)
    .replace(
      /PROXIES/g,
      moduleExists(proxiesPath) ? convertPathToRequireCall(proxiesPath) : '[]'
    );

  callback(null, result);
};

async function getNormalizedModules(cosmosConfig) {
  const { componentPaths } = cosmosConfig;

  if (componentPaths.length > 0) {
    console.warn(
      '[Cosmos] Using `componentPaths` config is deprecated. ' +
        'Please consider upgrading.'
    );

    const { components, fixtures } = getFilePaths(cosmosConfig);
    const fixtureFiles = [];

    // Convert old format to new format
    keys(fixtures).forEach(componentName => {
      keys(fixtures[componentName]).forEach(fixtureName => {
        fixtureFiles.push({
          filePath: fixtures[componentName][fixtureName],
          components: [
            {
              name: componentName,
              filePath: components[componentName]
            }
          ]
        });
      });
    });

    return { fixtureFiles, deprecatedComponentModules: components };
  }

  const { rootPath, fileMatch, exclude } = cosmosConfig;
  const fixtureFiles = await findFixtureFiles({ rootPath, fileMatch, exclude });

  return {
    fixtureFiles,
    deprecatedComponentModules: {}
  };
}

function getFixturePaths(files: Array<FixtureFile>): Array<string> {
  return files.map(file => file.filePath);
}

function convertPathsToRequireCalls(paths: Array<string>): string {
  const entries = paths.map(p => `'${p}':${convertPathToRequireCall(p)}`);

  return `{${entries.join(',')}}`;
}

function convertPathToRequireCall(p) {
  return `require('${p}')`;
}
