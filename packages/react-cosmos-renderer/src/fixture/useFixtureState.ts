import { useContext } from 'react';
import { FixtureState } from 'react-cosmos-core';
import { FixtureContext } from './FixtureContext.js';

export function useFixtureState<T extends object>() {
  const { fixtureState } = useContext(FixtureContext);
  return fixtureState as FixtureState & T;
}
