// @flow

import type { StateUpdater } from '../types/state';

export function updateState<T>(prevState: ?T, updater: StateUpdater<T>): T {
  const fixtureChange =
    typeof updater === 'function' ? updater(prevState) : updater;

  return {
    ...prevState,
    ...fixtureChange
  };
}
