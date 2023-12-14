import { FixtureStateControls, StateUpdater } from 'react-cosmos-core';

export type FixtureStateControlsUpdater = StateUpdater<
  FixtureStateControls | undefined
>;

export type SetFixtureStateControls = (
  update: FixtureStateControlsUpdater
) => void;
