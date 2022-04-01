import { findFixtureStateProps } from '../../../../core/fixtureState/props.js';
import {
  FixtureElementId,
  FixtureState,
  FixtureStateProps,
} from '../../../../core/fixtureState/types.js';
import { StateUpdater } from '../../../../utils/types.js';
import { stringifyElementId } from '../../../components/ValueInputTree/index.js';

export function createPropsFsUpdater(
  elementId: FixtureElementId,
  cb: (prevFs: FixtureState) => FixtureStateProps[]
): StateUpdater<FixtureState> {
  return prevFs => {
    const fsProps = findFixtureStateProps(prevFs, elementId);
    if (!fsProps) {
      const elId = stringifyElementId(elementId);
      console.warn(`Trying to update missing element with ID: ${elId}`);
      return prevFs;
    }

    return {
      ...prevFs,
      props: cb(prevFs),
    };
  };
}
