import loaderUtils from 'loader-utils';

const jsonLoader = require.resolve('json-loader');

const createComponentContext = path =>
  `require.context('${path}', true, /\\.jsx?$/)`;

const getFixturePathForExt = (path, ext) => (
  ext === 'json' ? `${jsonLoader}!${path}` : path
);

const createRelativeFixtureContext = (path, ext) =>
  `require.context('${getFixturePathForExt(path, ext)}', true, /\\/__fixtures__\\/.+\\.${ext}$/)`;

const createExternalFixtureContext = (path, ext) =>
  `require.context('${getFixturePathForExt(path, ext)}', true, /\\.${ext}$/)`;

/**
 * Inject require.context calls in bundle for each component/fixture path.
 * This tell webpack two things:
 * - To bundle all necessary component/fixture modules
 * - To watch for (and react to) added and changed component/fixture files
 */
module.exports = function embedModules(source) {
  const { componentPaths, fixturePaths } = loaderUtils.parseQuery(this.query);

  const componentContexts = `[${componentPaths.map(createComponentContext).join(',')}]`;
  const fixtureContexts = `[${componentPaths.map(path =>
    createRelativeFixtureContext(path, 'js')
  ).concat(componentPaths.map(path =>
    createRelativeFixtureContext(path, 'json')
  )).concat(fixturePaths.map(path =>
    createExternalFixtureContext(path, 'js')
  )).concat(fixturePaths.map(path =>
    createExternalFixtureContext(path, 'json')
  ))
  .join(',')}]`;

  return source
    .replace(/COMPONENT_CONTEXTS/g, componentContexts)
    .replace(/FIXTURE_CONTEXTS/g, fixtureContexts);
};
