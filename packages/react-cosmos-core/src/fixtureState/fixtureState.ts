import { FixtureState } from './types.js';

export type FixtureStateUpdater<T> = (prevState: T | undefined) => T;

export type FixtureStateChange<T> = T | FixtureStateUpdater<T>;

export function fixtureStateByName<T>(
  fixtureState: FixtureState,
  name: string
) {
  return fixtureState[name] as T | undefined;
}

export function updateFixtureState<T>(
  fixtureState: FixtureState,
  name: string,
  change: FixtureStateChange<T>
): FixtureState {
  const prevFs = fixtureStateByName<T>(fixtureState, name);
  const nextFs = applyFixtureStateChange<T>(prevFs, change);

  // Avoid unnecessary state updates
  if (nextFs === prevFs) {
    return fixtureState;
  }

  return {
    ...fixtureState,
    [name]: nextFs,
  };
}

export function applyFixtureStateChange<T>(
  prevState: T | undefined,
  change: FixtureStateChange<T>
): T {
  return isStateUpdater(change) ? change(prevState) : change;
}

function isStateUpdater<T>(
  change: FixtureStateChange<T>
): change is FixtureStateUpdater<T> {
  return typeof change === 'function';
}
