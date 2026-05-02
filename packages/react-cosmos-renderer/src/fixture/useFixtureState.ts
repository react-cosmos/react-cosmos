import { useCallback, useContext } from 'react';
import type { FixtureStateChange } from 'react-cosmos-core';
import { fixtureStateByName, updateFixtureState } from 'react-cosmos-core';
import { FixtureContext } from './FixtureContext.js';

export function useFixtureState<T>(name: string) {
  const { fixtureState, setFixtureState } = useContext(FixtureContext);

  return [
    fixtureStateByName<T>(fixtureState, name),

    useCallback(
      (change: FixtureStateChange<T>) => {
        setFixtureState(prevFs => updateFixtureState(prevFs, name, change));
      },
      [name, setFixtureState]
    ),
  ] as const;
}
