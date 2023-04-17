import React, { useMemo } from 'react';
import { FixtureContext } from '../fixture/FixtureContext.js';
import { FixtureState, SetFixtureState } from '../fixtureState/types.js';
import { getDecoratedFixtureElement } from './getDecoratedFixtureElement/index.js';
import {
  ReactDecorator,
  ReactDecoratorModule,
  ReactFixture,
} from './userModuleTypes.js';

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
    return getDecoratedFixtureElement(fixture, decorators, {
      fixtureState,
      setFixtureState,
      onErrorReset,
    });
  }, [
    fixture,
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
