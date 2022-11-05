import React from 'react';
import { FixtureState, SetFixtureState } from '../../fixtureState/types.js';
import { getSortedDecoratorsForFixturePath } from '../getSortedDecoratorsForFixturePath.js';
import { ReactDecorator, ReactDecorators } from '../reactTypes.js';
import { FixtureId } from '../../fixture/types.js';
import { FixtureContext } from '../../fixture/FixtureContext.js';
import { getDecoratedFixtureElement } from './getDecoratedFixtureElement/index.js';

type Props = {
  fixtureId: FixtureId;
  fixture: React.ReactNode;
  systemDecorators: ReactDecorator[];
  userDecorators: ReactDecorators;
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
  renderMessage?: (args: { msg: string }) => React.ReactNode;
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
  const contextValue = React.useMemo(
    () => ({ fixtureState, setFixtureState }),
    [fixtureState, setFixtureState]
  );
  const decoratorProps = React.useMemo(
    () => ({ fixtureState, setFixtureState, onErrorReset }),
    [fixtureState, onErrorReset, setFixtureState]
  );
  const decorators = React.useMemo(
    () => mergeDecorators(fixtureId, systemDecorators, userDecorators),
    [fixtureId, systemDecorators, userDecorators]
  );
  const decoratedFixture = React.useMemo(
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
