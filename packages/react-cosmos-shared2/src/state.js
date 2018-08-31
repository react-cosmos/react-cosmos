// @flow

import type { StateUpdater } from '../types/state';

export function updateState<T>(fixtureState: ?T, updater: StateUpdater<T>): T {
  const fixtureChange =
    typeof updater === 'function' ? updater(fixtureState) : updater;

  return {
    ...fixtureState,
    ...fixtureChange
  };
}
