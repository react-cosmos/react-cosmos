import { useContext } from 'react';
import { FixtureState, StateUpdater } from 'react-cosmos-core';
import { FixtureContext } from './FixtureContext.js';

export function useFixtureState<T extends object = {}>() {
  const { fixtureState, setFixtureState } = useContext(FixtureContext);
  return [
    fixtureState as FixtureState & T,
    setFixtureState as (update: StateUpdater<FixtureState & T>) => unknown,
  ] as const;
}
