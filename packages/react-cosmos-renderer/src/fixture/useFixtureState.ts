import { useCallback, useContext } from 'react';
import { StateUpdater } from 'react-cosmos-core';
import { FixtureContext } from './FixtureContext.js';

export function useFixtureState<T>(name: string) {
  const { fixtureState, setFixtureState } = useContext(FixtureContext);

  return [
    fixtureState[name] as T | undefined,

    useCallback(
      (value: StateUpdater<T | undefined>) => {
        setFixtureState(prevFixtureState => ({
          ...prevFixtureState,
          [name]: value(prevFixtureState[name] as T | undefined),
        }));
      },
      [name, setFixtureState]
    ),
  ] as const;
}
