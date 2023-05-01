import React, { useMemo } from 'react';
import {
  FixtureState,
  ReactDecorator,
  ReactDecoratorModule,
  ReactFixture,
  SetFixtureState,
} from 'react-cosmos-core';
import { FixtureCapture } from '../client/FixtureCapture/FixtureCapture.js';
import { FixtureContextProvider } from './FixtureContextProvider.js';
import { decorateFixture } from './decorateFixture.js';
import { createFixtureNode } from './fixtureNode.js';

type Props = {
  fixture: ReactFixture;
  systemDecorators: ReactDecorator[];
  userDecoratorModules: ReactDecoratorModule[];
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
  renderKey: number;
  onErrorReset?: () => unknown;
};
export function DecoratedFixture({
  fixture,
  systemDecorators,
  userDecoratorModules,
  fixtureState,
  setFixtureState,
  renderKey,
  onErrorReset = noop,
}: Props) {
  const decoratedFixture = useMemo(() => {
    const decorators = [
      ...systemDecorators,
      ...userDecoratorModules.map(m => m.default),
    ];
    return decorateFixture(
      <FixtureCapture decoratorId="root">
        {createFixtureNode(fixture)}
      </FixtureCapture>,
      decorators
    );
  }, [fixture, systemDecorators, userDecoratorModules]);

  return (
    <FixtureContextProvider
      fixtureState={fixtureState}
      setFixtureState={setFixtureState}
      renderKey={renderKey}
    >
      {decoratedFixture}
    </FixtureContextProvider>
  );
}

function noop() {}
