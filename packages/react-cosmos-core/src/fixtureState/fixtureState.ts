import { HybridStateUpdater, hybridStateUpdater } from '../utils/state.js';
import { FixtureState } from './types.js';

export function fixtureStateByName<T>(
  fixtureState: FixtureState,
  name: string
) {
  return fixtureState[name] as T | undefined;
}

export function fixtureStateUpdater<T>(
  fixtureState: FixtureState,
  name: string,
  updater: HybridStateUpdater<T | undefined>
) {
  return {
    ...fixtureState,
    [name]: hybridStateUpdater(fixtureState[name], updater),
  };
}
