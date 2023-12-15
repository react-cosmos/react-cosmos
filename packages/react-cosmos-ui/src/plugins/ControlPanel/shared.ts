import { ControlsFixtureState, StateUpdater } from 'react-cosmos-core';

export type FixtureStateControlsUpdater = StateUpdater<
  ControlsFixtureState | undefined
>;

export type SetFixtureStateControls = (
  update: FixtureStateControlsUpdater
) => void;
