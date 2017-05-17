import fs from 'fs';
import path from 'path';
import glob from 'glob';
import matchFixturePath from './match-fixture-path';
import { FIXTURE_EXTENSIONS_GLOB } from './fixture-extensions';

const SPECIAL_DIRS = ['__tests__', '__fixtures__'];

const isUnderSpecialDir = filePath =>
  SPECIAL_DIRS.some(dir => filePath.indexOf(`/${dir}/`) !== -1);

const getExternalFixtures = fixturePaths => fixturePaths.reduce((prev, next) => (
  [...prev, ...glob.sync(`${next}/**/*.{${FIXTURE_EXTENSIONS_GLOB}}`)]
), []);

const extractComponentName = (filePath, rootPath) => {
  let componentName = filePath
    .slice(rootPath.length + 1)
    .replace(/\.jsx?$/, '');

  // Nested components are normalized. E.g. Header/Header.jsx will only
  // show up as "Header" in the UI and will read fixtures from
  // Header/__fixtures__ or from a custom fixture path.
  // The same goes for Header/index.js
  const parts = componentName.split('/');
  if (parts.length > 1) {
    if (
      parts[parts.length - 1] === parts[parts.length - 2] ||
      parts[parts.length - 1] === 'index'
    ) {
      componentName = parts.slice(0, -1).join('/');
    }
  }

  return componentName;
};

const getMatchingFixtures = (fixtures, componentName) =>
  fixtures.reduce((matchingFixtures, fixturePath) => {
    const fixtureName = matchFixturePath(fixturePath, componentName);
    return fixtureName ? {
      ...matchingFixtures,
      [fixtureName]: fixturePath,
    } : matchingFixtures;
  }, {});

const getFilePaths = ({
  componentPaths = [],
  fixturePaths = [],
  ignore = [],
  getComponentName,
  getFixturePathsForComponent,
}) => {
  const extFixtures = getExternalFixtures(fixturePaths);
  const components = {};
  const fixtures = {};

  componentPaths.forEach(componentPath => {
    if (fs.lstatSync(componentPath).isFile()) {
      if (typeof getComponentName !== 'function') {
        throw new TypeError('Must implement getComponentName when using exact file paths in componentPaths');
      }

      const componentDir = path.dirname(componentPath);
      const componentName = getComponentName(componentPath);

      components[componentName] = componentPath;
      fixtures[componentName] = typeof getFixturePathsForComponent === 'function' ?
        getFixturePathsForComponent(componentName) :
        getMatchingFixtures([
          ...glob.sync(`${componentDir}/**/__fixtures__/**/*.{${FIXTURE_EXTENSIONS_GLOB}}`),
          ...extFixtures,
        ], componentName);
    } else {
      const relFixtures = glob.sync(`${componentPath}/**/__fixtures__/**/*.{${FIXTURE_EXTENSIONS_GLOB}}`);
      glob.sync(`${componentPath}/**/*.{${FIXTURE_EXTENSIONS_GLOB}}`).forEach(filePath => {
        if (
          isUnderSpecialDir(filePath) ||
          ignore.some(ignorePattern => filePath.match(ignorePattern))
        ) {
          return;
        }

        const componentName = extractComponentName(filePath, componentPath);

        components[componentName] = filePath;
        fixtures[componentName] = getMatchingFixtures(
          [...relFixtures, ...extFixtures], componentName,
        );
      });
    }
  });

  return {
    components,
    fixtures,
  };
};

export default getFilePaths;
