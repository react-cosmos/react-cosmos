import * as React from 'react';
import { isEqual } from 'lodash';
import {
  FixtureDecoratorId,
  createValues,
  extendWithValues,
  getFixtureStateClassState,
  findFixtureStateClassState,
  createFixtureStateClassState,
  removeFixtureStateClassState
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../../FixtureContext';
import { findRelevantElementPaths } from '../shared/findRelevantElementPaths';
import { replaceState } from './replaceState';
import { ElRefs, InitialStates } from './shared';

export function useFixtureState(
  children: React.ReactNode,
  decoratorId: FixtureDecoratorId,
  elRefs: React.MutableRefObject<ElRefs>,
  initialStates: React.MutableRefObject<InitialStates>
) {
  const elPaths = findRelevantElementPaths(children);
  const { fixtureState, setFixtureState } = React.useContext(FixtureContext);

  // Keep a copy of the previous fixture state to observe changes
  const prevFixtureStateRef = React.useRef(fixtureState);

  React.useEffect(() => {
    // Remove fixture state for removed child elements (likely via HMR)
    // FIXME: Also reset fixture state at this element path if the component
    // component type of the corresponding element changed
    const fsProps = getFixtureStateClassState(fixtureState, decoratorId);
    fsProps.forEach(({ elementId }) => {
      const { elPath } = elementId;
      if (elPaths.indexOf(elementId.elPath) === -1) {
        setFixtureState(prevFs => ({
          ...prevFs,
          classState: removeFixtureStateClassState(fixtureState, elementId)
        }));
        if (elRefs.current[elPath]) {
          delete elRefs.current[elPath];
          delete initialStates.current[elPath];
          // deleteRefHandler(this, this.props.decoratorId, elPath);
        }
      }
    });

    elPaths.forEach(elPath => {
      const elementId = { decoratorId, elPath };
      // Component fixture state can be provided before the fixture mounts (eg.
      // a previous snapshot of a fixture state or the current fixture state
      // from another renderer)
      const fsClassState = findFixtureStateClassState(fixtureState, elementId);
      if (!fsClassState) {
        if (initialStates.current[elPath]) {
          const { state } = initialStates.current[elPath];
          const elRef = elRefs.current[elPath];

          if (!isEqual(elRef.state, state)) {
            replaceState(elRef, state);
          }

          setFixtureState(prevFs => ({
            ...prevFs,
            classState: createFixtureStateClassState({
              fixtureState: prevFs,
              elementId,
              values: createValues(state)
            })
          }));
        }
      } else {
        const elRef = elRefs.current[elPath];
        // The el ref can be missing for three reasons:
        //   1. Element type is stateless
        //   2. Element type is a class, but doesn't have state. An instance exists
        //      but has been discarded because of its lack of state.
        //   3. Element instance unmounted and is about to remount. When this
        //      happens, the new instance will be handled when its ref fires again.
        if (!elRef) {
          return;
        }

        // The child's state can be out of sync with the fixture state for two
        // reasons:
        //   1. The child's state changed internally
        //   2. The fixture state changed
        // Here we're interested in the second scenario. In the first scenario
        // we want to let the component state override the fixture state.
        const prevFsClassState = findFixtureStateClassState(
          prevFixtureStateRef.current,
          elementId
        );
        if (prevFsClassState && !isEqual(prevFsClassState, fsClassState)) {
          return replaceState(
            elRef,
            extendWithValues(elRef.state, fsClassState.values)
          );
        }
      }
    });
    // TODO: Explore improving perf
  }, [children, fixtureState]);

  React.useEffect(() => {
    prevFixtureStateRef.current = fixtureState;
  });
}
