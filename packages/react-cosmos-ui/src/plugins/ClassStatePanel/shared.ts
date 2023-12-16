import { ClassStateFixtureState, FixtureStateUpdater } from 'react-cosmos-core';

export type SetClassStateFixtureState = (
  updater: FixtureStateUpdater<ClassStateFixtureState>
) => void;

export const CLASS_STATE_TREE_EXPANSION_STORAGE_KEY = 'classStateTreeExpansion';
