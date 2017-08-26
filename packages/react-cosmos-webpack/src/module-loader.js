import path from 'path';
import loaderUtils from 'loader-utils';
import traverse from 'traverse';
import getCosmosConfig from 'react-cosmos-config';
import getFilePaths from 'react-cosmos-voyager';

const convertPathToRequireCall = p => `require('${p}')`;

const convertPathMapToRequireCalls = paths => {
  const props = [];

  Object.keys(paths).forEach(key => {
    const val = paths[key];
    const newVal =
      typeof val === 'string'
        ? convertPathToRequireCall(val)
        : convertPathMapToRequireCalls(val);

    props.push(`'${key}':${newVal}`);
  });

  return `{${props.join(',')}}`;
};

const convertPathListToRequireCalls = paths =>
  `[${paths.map(convertPathToRequireCall).join(',')}]`;

const getUniqueDirsOfUserModules = (components, fixtures) => {
  const dirs = new Set();

  traverse(components).forEach(val => {
    if (typeof val === 'string') {
      dirs.add(path.dirname(val));
    }
  });
  traverse(fixtures).forEach(val => {
    if (typeof val === 'string') {
      dirs.add(path.dirname(val));
    }
  });

  return [...dirs];
};

const convertDirPathsToContextCalls = dirPaths =>
  `[${dirPaths.map(
    dirPath => `require.context('${dirPath}', false, /\\.jsx?$/)`
  )}]`;

/**
 * Inject require calls in bundle for each component/fixture path and
 * require.context calls for each dir with user modules. Tells webpack to
 * - Bundle all necessary component/fixture modules
 * - Watch for (and react to) added and changed component/fixture files
 */
module.exports = function embedModules(source) {
  const { cosmosConfigPath } = loaderUtils.getOptions(this);
  const cosmosConfig = getCosmosConfig(cosmosConfigPath);
  const { components, fixtures } = getFilePaths(cosmosConfig);
  const { proxies } = cosmosConfig;
  const contexts = getUniqueDirsOfUserModules(components, fixtures);

  contexts.forEach(dirPath => {
    // This ensures this loader is invalidated whenever a new component/fixture
    // file is created or renamed, which leads succesfully uda ...
    this.addDependency(dirPath);
  });

  return source
    .replace(/COMPONENTS/g, convertPathMapToRequireCalls(components))
    .replace(/FIXTURES/g, convertPathMapToRequireCalls(fixtures))
    .replace(/PROXIES/g, convertPathListToRequireCalls(proxies))
    .replace(/CONTEXTS/g, convertDirPathsToContextCalls(contexts));
};
