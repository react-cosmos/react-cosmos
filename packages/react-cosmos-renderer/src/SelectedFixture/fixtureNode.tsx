import React from 'react';
import { ReactFixture } from 'react-cosmos-core';

export function createFixtureNode(fixture: ReactFixture): React.ReactNode {
  return isFunctionFixture(fixture) ? (
    <FixtureElement Component={fixture} />
  ) : (
    fixture
  );
}

function isFunctionFixture(
  fixture: ReactFixture
): fixture is React.FunctionComponent {
  return typeof fixture === 'function';
}

function FixtureElement({ Component }: { Component: React.FunctionComponent }) {
  return <Component />;
}
FixtureElement.cosmosCapture = false;
