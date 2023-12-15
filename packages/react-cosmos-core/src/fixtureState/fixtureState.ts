import { FixtureState } from './types.js';

export function fixtureStateByName<T>(
  fixtureState: FixtureState,
  name: string
) {
  return fixtureState[name] as T | undefined;
}
