import fs from 'fs';
import glob from 'glob';

// Modules are require calls wrapped in functions instead of plain paths
// in order to help bundlers like Webpack know which files to bundle.
const getRequireCb = (path) => `()=>require('${path}')`;

const getFixtures = (componentsRootPath, componentCleanPath) => {
  const fixturesRootPath = `${componentsRootPath}/__fixtures__/${componentCleanPath}`;

  let fixtures = '{';
  glob.sync(`${fixturesRootPath}/*.{js,json}`).forEach((fixturePath) => {
    const nameMatcher = new RegExp(`^${fixturesRootPath}/(.+).(js|json)$`);
    const matches = fixturePath.match(nameMatcher);
    const name = matches[1];
    const ext = matches[2];

    let absPath = fs.realpathSync(fixturePath);
    if (ext === 'json') {
      // It's crucial for Cosmos to not depend on any user loader. This way the
      // webpack configs can point solely to the user deps for loaders.
      absPath = `${require.resolve('json-loader')}!${absPath}`;
    }

    fixtures += `'${name}':${getRequireCb(absPath)},`;
  });
  fixtures += '}';

  return fixtures;
};

export default function buildModulePaths(componentPaths, ignorePatterns = []) {
  let components = '{';
  let fixtures = '{';
  componentPaths.forEach((componentsRootPath) => {
    glob.sync(`${componentsRootPath}/**/*{.js,.jsx}`).forEach((componentPath) => {
      // Remove root path (including trailing slash) and extension
      const pathMatcher = new RegExp(`^${componentsRootPath}/(.+).jsx?$`);
      const cleanPath = componentPath.match(pathMatcher)[1];

      if (
        // Ignore special folders like __tests__ or __fixtures__
        cleanPath.indexOf('_') === 0 ||
        ignorePatterns.some((ignorePattern) => cleanPath.match(ignorePattern))
      ) {
        return;
      }

      const absPath = fs.realpathSync(componentPath);
      const componentFixtures = getFixtures(componentsRootPath, cleanPath);

      components += `'${cleanPath}':${getRequireCb(absPath)},`;
      fixtures += `'${cleanPath}':${componentFixtures},`;
    });
  });
  components += '}';
  fixtures += '}';

  return { components, fixtures };
}
