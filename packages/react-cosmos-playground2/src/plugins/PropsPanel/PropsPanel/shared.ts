import {
  findFixtureStateProps,
  FixtureElementId,
  FixtureState,
  FixtureStateProps
} from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import { stringifyElementId } from '../../../shared/ui/valueInputTree';

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
      props: cb(prevFs)
    };
  };
}
