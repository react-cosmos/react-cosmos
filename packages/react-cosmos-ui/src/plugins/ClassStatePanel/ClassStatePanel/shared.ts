import {
  ClassStateFixtureState,
  findFixtureStateClassState,
  FixtureElementId,
  FixtureStateUpdater,
} from 'react-cosmos-core';
import { stringifyElementId } from '../../../components/ValueInputTree/index.js';

export function classStateFsItemUpdater(
  elementId: FixtureElementId,
  cb: FixtureStateUpdater<ClassStateFixtureState>
): FixtureStateUpdater<ClassStateFixtureState> {
  return prevFs => {
    const fsItem = findFixtureStateClassState(prevFs, elementId);
    if (!fsItem) {
      const elId = stringifyElementId(elementId);
      console.warn(`Trying to update missing element with ID: ${elId}`);
      return prevFs ?? [];
    }

    return cb(prevFs);
  };
}
