import React from 'react';
import {
  ReactDecorator,
  ReactDecoratorProps,
  ReactFixture,
} from '../../reactTypes.js';
import { FixtureCapture } from '../FixtureCapture/index.js';
import { FixtureElement } from './FixtureElement.js';

export function getDecoratedFixtureElement(
  fixture: ReactFixture,
  decorators: ReactDecorator[],
  decoratorProps: Omit<ReactDecoratorProps, 'children'>
) {
  const fixtureElement = (
    <FixtureCapture decoratorId="root">
      {getFixtureElement(fixture)}
    </FixtureCapture>
  );

  return [...decorators]
    .reverse()
    .reduce(
      (prevElement, Decorator) => (
        <Decorator {...decoratorProps}>{prevElement}</Decorator>
      ),
      fixtureElement
    );
}

function getFixtureElement(fixture: ReactFixture) {
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
