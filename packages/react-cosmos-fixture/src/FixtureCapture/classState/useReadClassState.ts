import * as React from 'react';
import { isEqual } from 'lodash';
import {
  createValues,
  extendWithValues,
  findFixtureStateClassState,
  FixtureDecoratorId,
  FixtureStateClassState,
  updateFixtureStateClassState
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../../FixtureContext';
import { findRelevantElementPaths } from '../shared/findRelevantElementPaths';
import { ElRefs } from './shared';

// How often to check the state of the loaded component and update the fixture
// state if it changed
const REFRESH_INTERVAL = 200;

export function useReadClassState(
  fixture: React.ReactNode,
  decoratorId: FixtureDecoratorId,
  elRefs: React.MutableRefObject<ElRefs>
) {
  const elPaths = findRelevantElementPaths(fixture);
  const { fixtureState, setFixtureState } = React.useContext(FixtureContext);
  const timeoutId = React.useRef<null | number>(null);

  React.useEffect(() => {
    // The check should run even if no element paths are found at mount, because
    // the fixture can change during the lifecycle of a FixtureCapture instance
    // and the updated fixture might contain elements of stateful components
    scheduleStateCheck();
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  });

  function scheduleStateCheck() {
    // Is there a better way to listen to component state changes?
    timeoutId.current = window.setTimeout(checkState, REFRESH_INTERVAL);
  }

  function checkState() {
    let fixtureStateChangeScheduled = false;
    Object.keys(elRefs.current).map(async elPath => {
      if (elPaths.indexOf(elPath) === -1) {
        throw new Error(
          `[FixtureCapture] Child ref exists for missing element path "${elPath}"`
        );
      }

      const { state } = elRefs.current[elPath];
      const elementId = { decoratorId, elPath };
      const fsClassState = findFixtureStateClassState(fixtureState, elementId);
      if (
        fsClassState &&
        state &&
        !doesFixtureStateMatchClassState(fsClassState, state)
      ) {
        fixtureStateChangeScheduled = true;
        setFixtureState(prevFs => ({
          ...prevFs,
          classState: updateFixtureStateClassState({
            fixtureState: prevFs,
            elementId,
            values: createValues(state)
          })
        }));
      }
    });

    if (!fixtureStateChangeScheduled) {
      scheduleStateCheck();
    }
  }
}

function doesFixtureStateMatchClassState(
  fsClassState: FixtureStateClassState,
  state: {}
) {
  return isEqual(state, extendWithValues(state, fsClassState.values));
}
