import {
  findFixtureStateProps,
  FixtureElementId,
  FixtureState,
  FixtureStateProps
} from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';

export function createPropsFsUpdater(
  elementId: FixtureElementId,
  cb: (prevFs: FixtureState) => FixtureStateProps[]
): StateUpdater<FixtureState> {
  return prevFs => {
    const fsProps = findFixtureStateProps(prevFs, elementId);
    if (!fsProps) {
      console.warn(`Element id ${elementId} no longer exists`);
      return prevFs;
    }

    return {
      ...prevFs,
      props: cb(prevFs)
    };
  };
}
