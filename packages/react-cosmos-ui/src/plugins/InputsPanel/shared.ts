import type {
  FixtureStateUpdater,
  InputsFixtureState,
} from 'react-cosmos-core';

export type SetInputsFixtureState = (
  updater: FixtureStateUpdater<InputsFixtureState>
) => void;
