import matchFixturePath from './match-fixture-path';
import { getComponentContexts, getFixtureContexts } from './get-contexts';

const SPECIAL_DIRS = ['__tests__', '__fixtures__'];

const isUnderSpecialDir = path =>
  SPECIAL_DIRS.some(dir => path.indexOf(`/${dir}/`) !== -1);

/**
 * Traverse through a list of webpack contexts (via require.context) and map
 * components found along with their corresponding fixtures.
 */
const expandModulePaths = (ignorePatterns = []) => {
  const componentContexts = getComponentContexts();
  const fixtureContexts = getFixtureContexts();
  const components = {};
  const fixtures = {};

  componentContexts.forEach((componentContext) => {
    componentContext.keys().forEach((componentPath) => {
      if (
        isUnderSpecialDir(componentPath) ||
        ignorePatterns.some(ignorePattern => componentPath.match(ignorePattern))
      ) {
        return;
      }

      let componentCleanPath = componentPath.match(/\.\/(.+?)\.jsx?/)[1];
      const parts = componentCleanPath.split('/');

      // Nested components are normalized. E.g. Header/Header.jsx will only
      // show up as "Header" in the UI and will read fixtures from
      // Header/__fixtures__ or from a custom fixture path.
      if (parts.length > 1) {
        if (parts[parts.length - 1] === parts[parts.length - 2]) {
          componentCleanPath = parts.slice(0, -1).join('/');
        }
      }

      components[componentCleanPath] = componentContext(componentPath);
      fixtures[componentCleanPath] = {};

      fixtureContexts.forEach((fixtureContext) => {
        fixtureContext.keys().forEach((fixturePath) => {
          const name = matchFixturePath(fixturePath, componentCleanPath);
          if (name) {
            fixtures[componentCleanPath][name] = fixtureContext(fixturePath);
          }
        });
      });
    });
  });

  return { components, fixtures };
};

export default expandModulePaths;
