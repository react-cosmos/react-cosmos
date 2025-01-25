import { isEqual } from 'lodash-es';
import { ReactNode, RefObject, useEffect, useRef } from 'react';
import {
  ClassStateFixtureState,
  ClassStateFixtureStateItem,
  FixtureDecoratorId,
  createValues,
  extendWithValues,
  findClassStateFixtureStateItem,
  updateClassStateFixtureStateItem,
} from 'react-cosmos-core';
import { useFixtureState } from '../../useFixtureState.js';
import { findRelevantElementPaths } from '../shared/findRelevantElementPaths.js';
import { ElRefs } from './shared.js';

// How often to check the state of the loaded component and update the fixture
// state if it changed
const REFRESH_INTERVAL = 200;

export function useReadClassState(
  fixture: ReactNode,
  decoratorId: FixtureDecoratorId,
  elRefs: RefObject<ElRefs>
) {
  const elPaths = findRelevantElementPaths(fixture);
  const [classStateFs, setClassStateFs] =
    useFixtureState<ClassStateFixtureState>('classState');
  const timeoutId = useRef<number | null>(null);

  useEffect(() => {
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
      const fsItem = findClassStateFixtureStateItem(classStateFs, elementId);
      if (fsItem && state && !doesFixtureStateMatchClassState(fsItem, state)) {
        fixtureStateChangeScheduled = true;
        setClassStateFs(prevFs =>
          updateClassStateFixtureStateItem({
            classStateFs: prevFs,
            elementId,
            values: createValues(state),
          })
        );
      }
    });

    if (!fixtureStateChangeScheduled) {
      scheduleStateCheck();
    }
  }
}

function doesFixtureStateMatchClassState(
  fsClassState: ClassStateFixtureStateItem,
  state: {}
) {
  return isEqual(state, extendWithValues(state, fsClassState.values));
}
