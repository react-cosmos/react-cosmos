import React, { useMemo } from 'react';
import {
  FixtureState,
  ReactDecorator,
  ReactDecoratorModule,
  SetFixtureState,
} from 'react-cosmos-core';
import { decorateFixture } from '../shared/decorateFixture.js';
import { FixtureCapture } from './FixtureCapture/FixtureCapture.js';
import { FixtureContext } from './FixtureContext.js';

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
  // Prevent unintentional renders https://reactjs.org/docs/context.html#caveats
  const contextValue = useMemo(
    () => ({ fixtureState, setFixtureState }),
    [fixtureState, setFixtureState]
  );

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
    <FixtureContext.Provider
      // renderKey controls whether to reuse previous instances (and
      // transition props) or rebuild render tree from scratch
      key={renderKey}
      value={contextValue}
    >
      {decoratedFixture}
    </FixtureContext.Provider>
  );
}

function noop() {}
