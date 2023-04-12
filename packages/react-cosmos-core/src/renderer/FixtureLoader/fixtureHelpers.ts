import { isMultiFixture } from '../isMultiFixture.js';
import { ReactFixture, ReactFixtureExport } from '../reactTypes.js';

// TODO: Rename file to getFixture.ts
export function getFixture(
  fixtureExport: ReactFixtureExport,
  fixtureName?: string
): void | ReactFixture {
  if (fixtureName === undefined) {
    if (isMultiFixture(fixtureExport)) {
      // Fixture name missing in multi fixture
      const fixtureNames = Object.keys(fixtureExport);
      return fixtureExport[fixtureNames[0]];
    }

    return fixtureExport;
  }

  if (!isMultiFixture(fixtureExport)) {
    // Fixture name not found in single fixture
    return;
  }

  return fixtureExport[fixtureName];
}
