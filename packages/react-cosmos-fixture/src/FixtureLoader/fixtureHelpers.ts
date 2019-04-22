import * as React from 'react';
import { isElement } from 'react-is';
import { FixtureNamesByPath } from 'react-cosmos-shared2/renderer';
import { NodeMap, FixtureExport, FixturesByPath } from '../shared';

export function getFixtureNames(fixtures: FixturesByPath): FixtureNamesByPath {
  return Object.keys(fixtures).reduce((prev, fixturePath) => {
    const fixtureExport = fixtures[fixturePath];
    return {
      ...prev,
      [fixturePath]: isNodeMap(fixtureExport)
        ? Object.keys(fixtureExport)
        : null
    };
  }, {});
}

export function getFixtureNode(
  fixtureExport: FixtureExport,
  fixtureName: null | string
): void | React.ReactNode {
  if (fixtureName === null) {
    if (isNodeMap(fixtureExport)) {
      // Fixture name missing in multi fixture
      return;
    }

    return fixtureExport;
  }

  if (!isNodeMap(fixtureExport)) {
    // Fixture name not found in single fixture
    return;
  }

  return (fixtureExport as NodeMap)[fixtureName];
}

function isNodeMap(fixtureExport: FixtureExport): fixtureExport is NodeMap {
  return (
    fixtureExport !== null &&
    typeof fixtureExport === 'object' &&
    !isElement(fixtureExport)
  );
}
