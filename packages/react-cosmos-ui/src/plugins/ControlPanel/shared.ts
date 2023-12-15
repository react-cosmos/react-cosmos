import { ControlsFixtureState, FixtureStateUpdater } from 'react-cosmos-core';

export type SetFixtureStateControls = (
  updater: FixtureStateUpdater<ControlsFixtureState>
) => void;
