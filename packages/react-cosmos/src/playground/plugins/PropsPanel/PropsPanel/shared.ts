import { findFixtureStateProps } from '../../../../utils/fixtureState/props';
import {
  FixtureElementId,
  FixtureState,
  FixtureStateProps,
} from '../../../../utils/fixtureState/types';
import { StateUpdater } from '../../../../utils/types';
import { stringifyElementId } from '../../../shared/valueInputTree';

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
