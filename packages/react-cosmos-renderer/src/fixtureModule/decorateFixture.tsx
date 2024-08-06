import React from 'react';
import { ReactDecorator } from 'react-cosmos-core';

export function decorateFixture(
  fixtureNode: React.ReactNode,
  fixtureOptions: {},
  decorators: ReactDecorator[]
): React.ReactElement {
  return (
    <>
      {[...decorators].reverse().reduce(
        (prevElement, Decorator) => (
          <Decorator options={fixtureOptions}>{prevElement}</Decorator>
        ),
        fixtureNode
      )}
    </>
  );
}
