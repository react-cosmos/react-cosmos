import { FixtureStateUpdater, PropsFixtureState } from 'react-cosmos-core';

export type SetFixtureStateProps = (
  updater: FixtureStateUpdater<PropsFixtureState>
) => void;

export const PROPS_TREE_EXPANSION_STORAGE_KEY = 'propsTreeExpansion';
