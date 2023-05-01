import React, { useMemo } from 'react';
import {
  FixtureState,
  ReactDecorator,
  ReactDecoratorModule,
  SetFixtureState,
} from 'react-cosmos-core';
import { FixtureContextProvider } from '../shared/FixtureContextProvider.js';
import { decorateFixture } from '../shared/decorateFixture.js';
import { FixtureCapture } from './FixtureCapture/FixtureCapture.js';

type Props = {
  children: React.ReactNode;
  systemDecorators: ReactDecorator[];
  userDecoratorModules: ReactDecoratorModule[];
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
  renderKey: number;
  onErrorReset?: () => unknown;
};
export function DecoratedFixture({
  children,
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
      <FixtureCapture decoratorId="root">{children}</FixtureCapture>,
      decorators,
      {
        fixtureState,
        setFixtureState,
        onErrorReset,
      }
    );
  }, [
    children,
    fixtureState,
    onErrorReset,
    setFixtureState,
    systemDecorators,
    userDecoratorModules,
  ]);

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
