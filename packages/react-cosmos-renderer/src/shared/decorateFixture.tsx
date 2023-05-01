import React from 'react';
import { ReactDecorator, ReactDecoratorProps } from 'react-cosmos-core';

export function decorateFixture(
  fixtureNode: React.ReactNode,
  decorators: ReactDecorator[],
  decoratorProps: Omit<ReactDecoratorProps, 'children'>
): React.ReactElement {
  return (
    <>
      {[...decorators].reverse().reduce(
        (prevElement, Decorator) => (
          <Decorator {...decoratorProps}>{prevElement}</Decorator>
        ),
        fixtureNode
      )}
    </>
  );
}
