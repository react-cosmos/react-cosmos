// @flow

import type { FixtureState, FixtureStateUpdater } from '../types/fixture';

export function setFixtureUpdater(
  fixtureState: FixtureState,
  updater: FixtureStateUpdater
): FixtureState {
  const fixtureChange =
    typeof updater === 'function' ? updater(fixtureState) : updater;

  return {
    ...fixtureState,
    ...fixtureChange
  };
}
