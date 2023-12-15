import { HybridStateChange, applyStateChange } from '../utils/state.js';
import { FixtureState } from './types.js';

export function fixtureStateByName<T>(
  fixtureState: FixtureState,
  name: string
) {
  return fixtureState[name] as T | undefined;
}

export function applyFixtureStateChange<T>(
  fixtureState: FixtureState,
  name: string,
  change: HybridStateChange<T | undefined>
) {
  return {
    ...fixtureState,
    [name]: applyStateChange(fixtureStateByName<T>(fixtureState, name), change),
  };
}
