import { ControlsFixtureState, extendWithValue } from 'react-cosmos-core';
import { useFixtureState } from '../useFixtureState.js';

export function useCurrentValue<T>(inputName: string, defaultValue: T): T {
  const [fixtureState] = useFixtureState<ControlsFixtureState>('controls');
  const controlFs = fixtureState && fixtureState[inputName];
  return controlFs && controlFs.type === 'standard'
    ? // Types of fixture state values cannot be guaranteed at run time, which
      // means that tampering with the fixture state can cause runtime errors
      (extendWithValue(defaultValue, controlFs.currentValue) as T)
    : defaultValue;
}
