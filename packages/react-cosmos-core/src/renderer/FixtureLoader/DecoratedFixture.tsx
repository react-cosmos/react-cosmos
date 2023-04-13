import React, { useMemo } from 'react';
import { FixtureContext } from '../../fixture/FixtureContext.js';
import { FixtureState, SetFixtureState } from '../../fixtureState/types.js';
import {
  ReactDecorator,
  ReactDecoratorModule,
  ReactFixture,
} from '../reactTypes.js';
import { getDecoratedFixtureElement } from './getDecoratedFixtureElement/index.js';

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

  const decoratorProps = useMemo(
    () => ({ fixtureState, setFixtureState, onErrorReset }),
    [fixtureState, onErrorReset, setFixtureState]
  );

  const decorators = useMemo(
    () => [...systemDecorators, ...userDecoratorModules.map(m => m.default)],
    [systemDecorators, userDecoratorModules]
  );

  const decoratedFixture = useMemo(
    () => getDecoratedFixtureElement(fixture, decorators, decoratorProps),
    [decoratorProps, decorators, fixture]
  );

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
