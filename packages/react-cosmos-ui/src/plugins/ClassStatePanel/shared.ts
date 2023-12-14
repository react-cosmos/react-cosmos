import { FixtureStateClassState, StateUpdater } from 'react-cosmos-core';

export type FixtureStateClassStateUpdater = StateUpdater<
  FixtureStateClassState[] | undefined
>;

export type SetFixtureStateClassState = (
  update: FixtureStateClassStateUpdater
) => void;

export const CLASS_STATE_TREE_EXPANSION_STORAGE_KEY = 'classStateTreeExpansion';
