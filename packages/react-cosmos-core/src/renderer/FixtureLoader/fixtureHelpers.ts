import { isMultiFixture } from '../isMultiFixture.js';
import {
  ReactFixture,
  ReactFixtureExport,
  ReactFixtureMap,
} from '../reactTypes.js';

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

  // FIXME: Why does fixtureExport need to be cast as ReactFixtureMap when
  // the type predicate returned by isMultiFixture already ensures it?
  const multiFixtureExport: ReactFixtureMap = fixtureExport;
  return multiFixtureExport[fixtureName];
}
