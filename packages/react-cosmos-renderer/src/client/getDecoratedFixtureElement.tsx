import React from 'react';
import { ReactDecorator, ReactDecoratorProps } from 'react-cosmos-core';
import { FixtureCapture } from './FixtureCapture/FixtureCapture.js';

export function getDecoratedFixtureElement(
  children: React.ReactNode,
  decorators: ReactDecorator[],
  decoratorProps: Omit<ReactDecoratorProps, 'children'>
) {
  const fixtureElement = (
    <FixtureCapture decoratorId="root">{children}</FixtureCapture>
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
