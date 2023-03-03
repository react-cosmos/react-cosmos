import { isMultiFixture } from '../isMultiFixture.js';
import { ReactFixture, ReactFixtureExport } from '../reactTypes.js';

export function getFixture(
  fixtureExport: ReactFixtureExport,
  fixtureName?: string
): void | ReactFixture {
  if (!isMultiFixture(fixtureExport)) {
    return fixtureExport;
  }

  if (fixtureName) {
    return fixtureExport[fixtureName];
  }

  const fixtureNames = Object.keys(fixtureExport);
  return fixtureExport[fixtureNames[0]];
}
