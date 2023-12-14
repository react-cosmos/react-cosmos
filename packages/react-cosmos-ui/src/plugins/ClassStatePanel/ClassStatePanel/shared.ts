import {
  findFixtureStateClassState,
  FixtureElementId,
} from 'react-cosmos-core';
import { stringifyElementId } from '../../../components/ValueInputTree/index.js';
import { FixtureStateClassStateUpdater } from '../shared.js';

export function createClassStateFsUpdater(
  elementId: FixtureElementId,
  cb: FixtureStateClassStateUpdater
): FixtureStateClassStateUpdater {
  return prevFs => {
    const fsClassState = findFixtureStateClassState(prevFs, elementId);
    if (!fsClassState) {
      const elId = stringifyElementId(elementId);
      console.warn(`Trying to update missing element with ID: ${elId}`);
      return prevFs;
    }

    return cb(prevFs);
  };
}
