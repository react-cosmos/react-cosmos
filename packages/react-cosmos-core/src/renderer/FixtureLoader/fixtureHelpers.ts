import { isMultiFixture } from '../isMultiFixture.js';
import { ReactFixture, ReactFixtureExport } from '../reactTypes.js';

export function getFixture(
  fixtureExport: ReactFixtureExport,
  fixtureName?: string
): void | ReactFixture {
  if (fixtureName === undefined) {
    if (isMultiFixture(fixtureExport)) {
      // Fixture name missing in multi fixture
      return;
    }

    return fixtureExport;
  }

  if (!isMultiFixture(fixtureExport)) {
    // Fixture name not found in single fixture
    return;
  }

  return fixtureExport[fixtureName];
}
