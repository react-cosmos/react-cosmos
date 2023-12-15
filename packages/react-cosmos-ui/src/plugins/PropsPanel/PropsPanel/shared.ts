import { findFixtureStateProps, FixtureElementId } from 'react-cosmos-core';
import { stringifyElementId } from '../../../components/ValueInputTree/index.js';
import { FixtureStatePropsUpdater } from '../shared.js';

export function propsFsItemUpdater(
  elementId: FixtureElementId,
  cb: FixtureStatePropsUpdater
): FixtureStatePropsUpdater {
  return prevFs => {
    const fsItem = findFixtureStateProps(prevFs, elementId);
    if (!fsItem) {
      const elId = stringifyElementId(elementId);
      console.warn(`Trying to update missing element with ID: ${elId}`);
      return prevFs;
    }

    return cb(prevFs);
  };
}
