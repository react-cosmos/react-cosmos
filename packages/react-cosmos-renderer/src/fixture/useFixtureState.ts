import { useCallback, useContext } from 'react';
import { StateUpdater, fixtureStateByName } from 'react-cosmos-core';
import { FixtureContext } from './FixtureContext.js';

export function useFixtureState<T>(name: string) {
  const { fixtureState, setFixtureState } = useContext(FixtureContext);

  return [
    fixtureStateByName<T>(fixtureState, name),

    useCallback(
      (value: StateUpdater<T | undefined>) => {
        setFixtureState(prevFs => ({
          ...prevFs,
          [name]: value(fixtureStateByName<T>(prevFs, name)),
        }));
      },
      [name, setFixtureState]
    ),
  ] as const;
}
