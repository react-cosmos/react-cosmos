import React from 'react';
import {
  ReactFixtureMap,
  ReactFixtureExport,
  isMultiFixture
} from 'react-cosmos-shared2/react';

export function getFixture(
  fixtureExport: ReactFixtureExport,
  fixtureName: null | string
): void | React.ReactNode {
  if (fixtureName === null) {
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

  return (fixtureExport as ReactFixtureMap)[fixtureName];
}
