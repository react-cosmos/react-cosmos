const buildPathMatchers = (componentCleanPath) => [
  `\\./__fixtures__/${componentCleanPath}/([a-z].*)\\.(js|json)$`,
  `\\./${componentCleanPath}/__fixtures__/([a-z].*)\\.(js|json)$`,
  `\\./${componentCleanPath}/([a-z].*)\\.(js|json)$`,
];

/**
 * Determine whether fixture belongs to component and return the fixture's
 * clean path when true.
 */
const matchComponentFixture = (fixturePath, componentCleanPath) => {
  const matchers = buildPathMatchers(componentCleanPath);

  for (let i = 0; i < matchers.length; i++) {
    const matchResult = fixturePath.match(new RegExp(matchers[i]));
    if (matchResult) {
      return matchResult[1];
    }
  }

  return false;
};

export default matchComponentFixture;
