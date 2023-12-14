import { findFixtureStateProps, FixtureElementId } from 'react-cosmos-core';
import { stringifyElementId } from '../../../components/ValueInputTree/index.js';
import { FixtureStatePropsUpdater } from '../shared.js';

export function createPropsFsUpdater(
  elementId: FixtureElementId,
  cb: FixtureStatePropsUpdater
): FixtureStatePropsUpdater {
  return prevFs => {
    const fsProps = findFixtureStateProps(prevFs, elementId);
    if (!fsProps) {
      const elId = stringifyElementId(elementId);
      console.warn(`Trying to update missing element with ID: ${elId}`);
      return prevFs;
    }

    return cb(prevFs);
  };
}
