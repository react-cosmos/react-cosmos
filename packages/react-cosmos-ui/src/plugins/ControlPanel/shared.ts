import { ControlsFixtureState, FixtureStateUpdater } from 'react-cosmos-core';

export type SetControlsFixtureState = (
  updater: FixtureStateUpdater<ControlsFixtureState>
) => void;
