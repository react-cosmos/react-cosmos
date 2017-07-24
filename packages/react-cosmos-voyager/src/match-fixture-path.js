import { FIXTURE_EXTENSIONS_REGEX } from './fixture-extensions';

const buildPathMatchers = (componentName, fixturesDir) => [
  `/${fixturesDir}/${componentName}/([^/]+)\\.(${FIXTURE_EXTENSIONS_REGEX})$`,
  `/${componentName}/${fixturesDir}/([^/]+)\\.(${FIXTURE_EXTENSIONS_REGEX})$`,
  `/${componentName}/([^/]+)\\.(${FIXTURE_EXTENSIONS_REGEX})$`,
];

const buildDepricatedPathMatchers = (componentName, fixturesDir) => [
  `/${componentName}/src/${fixturesDir}/([^/]+)\\.(${FIXTURE_EXTENSIONS_REGEX})$`,
];

/**
 * Determine whether fixture belongs to component and return the fixture's
 * clean path when true.
 */
const matchFixturePath = (fixturePath, componentName, fixturesDir) => {
  const matchers = buildPathMatchers(componentName, fixturesDir);

  for (let i = 0; i < matchers.length; i += 1) {
    const matchResult = fixturePath.match(new RegExp(matchers[i]));
    if (matchResult) {
      return matchResult[1];
    }
  }

  const depricatedMatchers = buildDepricatedPathMatchers(componentName, fixturesDir);

  for (let i = 0; i < depricatedMatchers.length; i += 1) {
    const matchResult = fixturePath.match(new RegExp(depricatedMatchers[i]));
    if (matchResult) {
      console.warn(`The fixture path "${fixturePath}" for component name "${componentName}" has matched a depricated pattern ${depricatedMatchers[i]}, use getFixturePathsForComponent in your cosmos.config.js to handle special cases instead`);
      return matchResult[1];
    }
  }

  return false;
};

export default matchFixturePath;
