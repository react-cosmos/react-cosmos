import {
  findFixtureStateClassState,
  FixtureElementId,
  FixtureState,
  FixtureStateClassState
} from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { stringifyElementId } from '../../../shared/ui/valueInputTree';

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
      classState: cb(prevFs)
    };
  };
}
