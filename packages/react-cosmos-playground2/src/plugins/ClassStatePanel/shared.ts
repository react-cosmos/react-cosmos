import {
  findFixtureStateClassState,
  FixtureElementId,
  FixtureState,
  FixtureStateClassState
} from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';

export const CLASS_STATE_TREE_EXPANSION_STORAGE_KEY = 'classStateTreeExpansion';

export function createClassStateFsUpdater(
  elementId: FixtureElementId,
  cb: (prevFs: FixtureState) => FixtureStateClassState[]
): StateUpdater<FixtureState> {
  return prevFs => {
    const fsClassState = findFixtureStateClassState(prevFs, elementId);
    if (!fsClassState) {
      console.warn(`Element id ${elementId} no longer exists`);
      return prevFs;
    }

    return {
      ...prevFs,
      classState: cb(prevFs)
    };
  };
}
