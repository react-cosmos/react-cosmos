import { ReactNode } from 'react';
import { isMultiFixture } from '../isMultiFixture.js';
import { ReactFixtureExport, ReactFixtureMap } from '../reactTypes.js';

export function getFixture(
  fixtureExport: ReactFixtureExport,
  fixtureName?: string
): void | ReactNode {
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
