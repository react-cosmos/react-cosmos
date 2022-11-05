import {
  findFixtureStateProps,
  FixtureElementId,
  FixtureState,
  FixtureStateProps,
  StateUpdater,
} from 'react-cosmos-core';
import { stringifyElementId } from '../../../components/ValueInputTree';

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
