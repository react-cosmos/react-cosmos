// @flow

import { isElement } from 'react-is';

import type { Node } from 'react';
import type { FixtureNamesByPath } from 'react-cosmos-shared2/renderer';
import type { NodeMap, FixtureExport, FixturesByPath } from '../index.js.flow';

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
): void | Node {
  if (fixtureName === null) {
    if (isNodeMap(fixtureExport)) {
      throw new Error(`Fixture name missing in multi fixture`);
    }

    return ((fixtureExport: any): Node);
  }

  if (!isNodeMap(fixtureExport)) {
    throw new Error(`Fixture name not found in single fixture: ${fixtureName}`);
  }

  return ((fixtureExport: any): NodeMap)[fixtureName];
}

function isNodeMap(fixtureExport: FixtureExport): boolean %checks {
  return (
    fixtureExport !== null &&
    typeof fixtureExport === 'object' &&
    !isElement(fixtureExport)
  );
}
