import { InputsFixtureState, extendWithValue } from 'react-cosmos-core';
import { useFixtureState } from '../useFixtureState.js';

export function useCurrentValue<T>(inputName: string, defaultValue: T): T {
  const [fixtureState] = useFixtureState<InputsFixtureState>('inputs');
  const inputFs = fixtureState && fixtureState[inputName];
  return inputFs && inputFs.type === 'standard'
    ? // Types of fixture state values cannot be guaranteed at run time, which
      // means that tampering with the fixture state can cause runtime errors
      (extendWithValue(defaultValue, inputFs.currentValue) as T)
    : defaultValue;
}
