import React from 'react';
import { ReactFixture } from 'react-cosmos-core';

export function getFixtureElement(fixture: ReactFixture) {
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

type FixtureElementProps = {
  Component: React.FunctionComponent;
};
function FixtureElement({ Component }: FixtureElementProps) {
  return <Component />;
}
FixtureElement.cosmosCapture = false;
