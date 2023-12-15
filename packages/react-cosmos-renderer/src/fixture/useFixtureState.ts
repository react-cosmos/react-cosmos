import { useCallback, useContext } from 'react';
import {
  HybridStateChange,
  applyFixtureStateChange,
  fixtureStateByName,
} from 'react-cosmos-core';
import { FixtureContext } from './FixtureContext.js';

export function useFixtureState<T>(name: string) {
  const { fixtureState, setFixtureState } = useContext(FixtureContext);

  return [
    fixtureStateByName<T>(fixtureState, name),

    useCallback(
      (change: HybridStateChange<T | undefined>) => {
        setFixtureState(prevFs =>
          applyFixtureStateChange(prevFs, name, change)
        );
      },
      [name, setFixtureState]
    ),
  ] as const;
}
