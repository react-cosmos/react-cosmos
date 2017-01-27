/* eslint-disable global-require */

import path from 'path';
import loaderUtils from 'loader-utils';
import traverse from 'traverse';
import importModule from 'react-cosmos-utils/lib/import-module';
import getFilePaths from 'react-cosmos-voyager';
import getConfig from './config';
import resolveUserPath from './utils/resolve-user-path';

const jsonLoader = require.resolve('json-loader');

const getRequirePath = filePath => (
  path.extname(filePath) === '.json' ? `${jsonLoader}!${filePath}` : filePath
);

const convertFilePathsToRequireCalls = (filePaths) => {
  const props = [];

  Object.keys(filePaths).forEach((key) => {
    const val = filePaths[key];
    const newVal = typeof val === 'string' ?
      `require('${getRequirePath(val)}')` :
      convertFilePathsToRequireCalls(val);

    props.push(`'${key}':${newVal}`);
  });

  return `{${props.join(',')}}`;
};

const getUniqueDirsOfUserModules = (components, fixtures) => {
  const dirs = new Set();

  traverse(components).forEach((val) => {
    if (typeof val === 'string') {
      dirs.add(path.dirname(val));
    }
  });
  traverse(fixtures).forEach((val) => {
    if (typeof val === 'string') {
      dirs.add(path.dirname(val));
    }
  });

  return [...dirs];
};

const convertDirPathsToContextCalls = dirPaths =>
  `[${dirPaths.map(dirPath => `require.context('${dirPath}', false)`)}]`;

/**
 * Inject require calls in bundle for each component/fixture path and
 * require.context calls for each dir with user modules. Tells webpack to
 * - Bundle all necessary component/fixture modules
 * - Watch for (and react to) added and changed component/fixture files
 */
module.exports = function embedModules(source) {
  const { cosmosConfigPath } = loaderUtils.parseQuery(this.query);
  const cosmosConfig = getConfig(importModule(require(cosmosConfigPath)));

  const {
    componentPaths,
    fixturePaths,
    ignore,
    getComponentName,
    getFixturePathsForComponent,
  } = cosmosConfig;

  const resolvedComponentPaths = componentPaths.map(p =>
    resolveUserPath(p, cosmosConfigPath));
  const resolvedFixturePaths = fixturePaths.map(p =>
    resolveUserPath(p, cosmosConfigPath));

  const { components, fixtures } = getFilePaths({
    componentPaths: resolvedComponentPaths,
    fixturePaths: resolvedFixturePaths,
    ignore,
    getComponentName,
    getFixturePathsForComponent,
  });
  const contexts = getUniqueDirsOfUserModules(components, fixtures);

  contexts.forEach((dirPath) => {
    // This ensures this loader is invalidated whenever a new component/fixture
    // file is created or renamed, which leads succesfully uda ...
    this.addDependency(dirPath);
  });

  return source
    .replace(/COMPONENTS/g, convertFilePathsToRequireCalls(components))
    .replace(/FIXTURES/g, convertFilePathsToRequireCalls(fixtures))
    .replace(/CONTEXTS/g, convertDirPathsToContextCalls(contexts));
};
