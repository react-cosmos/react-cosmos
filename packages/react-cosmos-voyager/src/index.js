import fs from 'fs';
import glob from 'glob';
import path from 'path';
import matchFixturePath from './match-fixture-path';

const SPECIAL_DIRS = ['__tests__', '__fixtures__'];

const isUnderSpecialDir = filePath =>
  SPECIAL_DIRS.some(dir => filePath.indexOf(`/${dir}/`) !== -1);

const getExternalFixtures = fixturePaths => fixturePaths.reduce((prev, next) => (
  [...prev, ...glob.sync(`${next}/**/*.{js,json}`)]
), []);

const extractComponentName = (filePath, rootPath) => {
  let componentName = filePath
    .slice(rootPath.length + 1)
    .replace(/\.jsx?$/, '');

  // Nested components are normalized. E.g. Header/Header.jsx will only
  // show up as "Header" in the UI and will read fixtures from
  // Header/__fixtures__ or from a custom fixture path.
  const parts = componentName.split('/');
  if (parts.length > 1) {
    if (parts[parts.length - 1] === parts[parts.length - 2]) {
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
}) => {
  const extFixtures = getExternalFixtures(fixturePaths);
  const components = {};
  const fixtures = {};

  componentPaths.forEach((componentPath) => {
    if (fs.lstatSync(componentPath).isFile()) {
      if (typeof getComponentName !== 'function') {
        throw new Error('Must implement getComponentName when using exact file paths in componentPaths');
      }

      const componentDir = path.dirname(componentPath);
      const relFixtures = glob.sync(`${componentDir}/**/__fixtures__/**/*.{js,json}`);
      const componentName = getComponentName(componentPath);

      components[componentName] = componentPath;
      fixtures[componentName] = getMatchingFixtures(
        [...relFixtures, ...extFixtures], componentName,
      );
    } else {
      const relFixtures = glob.sync(`${componentPath}/**/__fixtures__/**/*.{js,json}`);
      glob.sync(`${componentPath}/**/*.{js,jsx}`).forEach((filePath) => {
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

module.exports = getFilePaths;
