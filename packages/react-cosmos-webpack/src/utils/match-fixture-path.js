const buildPathMatchers = (componentCleanPath) => [
  `\\./__fixtures__/${componentCleanPath}/(.*)\\.(js|json)$`,
  `\\./${componentCleanPath}/__fixtures__/(.*)\\.(js|json)$`,
  `\\./${componentCleanPath}/(.*)\\.(js|json)$`,
];

/**
 * Determine whether fixture belongs to component and return the fixture's
 * clean path when true.
 */
const matchFixturePath = (fixturePath, componentCleanPath) => {
  const matchers = buildPathMatchers(componentCleanPath);

  for (let i = 0; i < matchers.length; i++) {
    const matchResult = fixturePath.match(new RegExp(matchers[i]));
    if (matchResult) {
      return matchResult[1];
    }
  }

  return false;
};

export default matchFixturePath;
