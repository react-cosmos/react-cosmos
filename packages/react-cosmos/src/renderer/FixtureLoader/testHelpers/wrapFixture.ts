import {
  ReactFixtureExport,
  ReactFixtureExports,
  ReactFixtureWrapper,
  ReactFixtureWrappers,
} from '../../../core/react/types.js';

export function wrapFixtures(
  fixtureExports: ReactFixtureExports
): ReactFixtureWrappers {
  return Object.keys(fixtureExports).reduce((acc, fixturePath) => {
    return { ...acc, [fixturePath]: wrapFixture(fixtureExports[fixturePath]) };
  }, {});
}

function wrapFixture(fixtureExport: ReactFixtureExport): ReactFixtureWrapper {
  return { module: { default: fixtureExport } };
}
