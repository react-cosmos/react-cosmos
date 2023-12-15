import { useCallback, useContext } from 'react';
import {
  HybridStateUpdater,
  fixtureStateByName,
  fixtureStateUpdater,
} from 'react-cosmos-core';
import { FixtureContext } from './FixtureContext.js';

export function useFixtureState<T>(name: string) {
  const { fixtureState, setFixtureState } = useContext(FixtureContext);

  return [
    fixtureStateByName<T>(fixtureState, name),

    useCallback(
      (value: HybridStateUpdater<T | undefined>) => {
        setFixtureState(prevFs => fixtureStateUpdater(prevFs, name, value));
      },
      [name, setFixtureState]
    ),
  ] as const;
}
