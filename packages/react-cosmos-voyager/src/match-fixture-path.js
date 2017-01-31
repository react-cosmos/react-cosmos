const buildPathMatchers = componentName => [
  `/__fixtures__/${componentName}/(.*)\\.(js|json)$`,
  `/${componentName}/(?:.+/)?__fixtures__/(.*)\\.(js|json)$`,
  `/${componentName}/(.*)\\.(js|json)$`,
];

/**
 * Determine whether fixture belongs to component and return the fixture's
 * clean path when true.
 */
const matchFixturePath = (fixturePath, componentName) => {
  const matchers = buildPathMatchers(componentName);

  for (let i = 0; i < matchers.length; i += 1) {
    const matchResult = fixturePath.match(new RegExp(matchers[i]));
    if (matchResult) {
      return matchResult[1];
    }
  }

  return false;
};

export default matchFixturePath;
