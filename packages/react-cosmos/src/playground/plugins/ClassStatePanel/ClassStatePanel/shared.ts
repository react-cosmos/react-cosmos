import { findFixtureStateClassState } from '../../../../core/fixtureState/classState.js';
import {
  FixtureElementId,
  FixtureState,
  FixtureStateClassState,
} from '../../../../core/fixtureState/types.js';
import { StateUpdater } from '../../../../utils/types.js';
import { stringifyElementId } from '../../../components/ValueInputTree/index.js';

export function createClassStateFsUpdater(
  elementId: FixtureElementId,
  cb: (prevFs: FixtureState) => FixtureStateClassState[]
): StateUpdater<FixtureState> {
  return prevFs => {
    const fsClassState = findFixtureStateClassState(prevFs, elementId);
    if (!fsClassState) {
      const elId = stringifyElementId(elementId);
      console.warn(`Trying to update missing element with ID: ${elId}`);
      return prevFs;
    }

    return {
      ...prevFs,
      classState: cb(prevFs),
    };
  };
}
