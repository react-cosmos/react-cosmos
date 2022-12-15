import React, { ReactNode, useMemo } from 'react';
import { FixtureContext } from '../../fixture/FixtureContext.js';
import { FixtureId } from '../../fixture/types.js';
import { FixtureState, SetFixtureState } from '../../fixtureState/types.js';
import { getSortedDecoratorsForFixturePath } from '../getSortedDecoratorsForFixturePath.js';
import {
  ReactDecorator,
  ReactDecorators,
  ReactFixture,
} from '../reactTypes.js';
import { getDecoratedFixtureElement } from './getDecoratedFixtureElement/index.js';

type Props = {
  fixtureId: FixtureId;
  fixture: ReactFixture;
  systemDecorators: ReactDecorator[];
  userDecorators: ReactDecorators;
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
  renderMessage?: (args: { msg: string }) => ReactNode;
  onErrorReset: () => unknown;
};

export function FixtureProvider({
  fixtureId,
  fixture,
  systemDecorators,
  userDecorators,
  fixtureState,
  setFixtureState,
  onErrorReset,
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
    () => mergeDecorators(fixtureId, systemDecorators, userDecorators),
    [fixtureId, systemDecorators, userDecorators]
  );
  const decoratedFixture = useMemo(
    () => getDecoratedFixtureElement(fixture, decorators, decoratorProps),
    [decoratorProps, decorators, fixture]
  );
  return (
    <FixtureContext.Provider value={contextValue}>
      {decoratedFixture}
    </FixtureContext.Provider>
  );
}

function mergeDecorators(
  fixtureId: FixtureId,
  systemDecorators: ReactDecorator[],
  userDecorators: ReactDecorators
) {
  return [
    ...systemDecorators,
    ...getSortedDecoratorsForFixturePath(fixtureId.path, userDecorators),
  ];
}
