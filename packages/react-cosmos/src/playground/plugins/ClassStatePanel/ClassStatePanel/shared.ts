import { findFixtureStateClassState } from '../../../../utils/fixtureState/classState';
import {
  FixtureElementId,
  FixtureState,
  FixtureStateClassState,
} from '../../../../utils/fixtureState/types';
import { StateUpdater } from '../../../../utils/types';
import { stringifyElementId } from '../../../components/ValueInputTree';

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
