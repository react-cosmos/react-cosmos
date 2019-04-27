import * as React from 'react';
import { isElement } from 'react-is';
import { FixtureNamesByPath } from 'react-cosmos-shared2/renderer';
import {
  ReactFixtureMap,
  ReactFixtureExport,
  ReactFixturesByPath
} from 'react-cosmos-shared2/react';

export function getFixtureNames(
  fixtures: ReactFixturesByPath
): FixtureNamesByPath {
  return Object.keys(fixtures).reduce((prev, fixturePath) => {
    const fixtureExport = fixtures[fixturePath];
    return {
      ...prev,
      [fixturePath]: isMultiFixture(fixtureExport)
        ? Object.keys(fixtureExport)
        : null
    };
  }, {});
}

export function getFixtureNode(
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

function isMultiFixture(
  fixtureExport: ReactFixtureExport
): fixtureExport is ReactFixtureMap {
  return (
    fixtureExport !== null &&
    typeof fixtureExport === 'object' &&
    !isElement(fixtureExport)
  );
}
