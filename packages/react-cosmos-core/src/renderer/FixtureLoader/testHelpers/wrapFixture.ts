import {
  ByPath,
  ReactFixtureExport,
  ReactFixtureWrapper,
} from '../../reactTypes.js';

export function wrapFixtures(
  fixtureExports: ByPath<ReactFixtureExport>
): ByPath<ReactFixtureWrapper> {
  return Object.keys(fixtureExports).reduce((acc, fixturePath) => {
    return { ...acc, [fixturePath]: wrapFixture(fixtureExports[fixturePath]) };
  }, {});
}

function wrapFixture(fixtureExport: ReactFixtureExport): ReactFixtureWrapper {
  return { module: { default: fixtureExport } };
}
