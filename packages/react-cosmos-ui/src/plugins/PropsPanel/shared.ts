import { PropsFixtureState, StateUpdater } from 'react-cosmos-core';

export type FixtureStatePropsUpdater = StateUpdater<
  PropsFixtureState | undefined
>;

export type SetFixtureStateProps = (update: FixtureStatePropsUpdater) => void;

export const PROPS_TREE_EXPANSION_STORAGE_KEY = 'propsTreeExpansion';
