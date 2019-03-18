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
import {
  ElRefs,
  InitialStates,
  CachedRefHandlers,
  useFixtureStateRef,
  useUnmount,
  replaceState
} from './shared';
import { decorateFixtureRefs } from './decorateFixtureRefs';

export function useFixtureState(
  children: React.ReactNode,
  decoratorId: FixtureDecoratorId,
  elRefs: React.MutableRefObject<ElRefs>
) {
  const elPaths = findRelevantElementPaths(children);
  const { fixtureState, setFixtureState } = React.useContext(FixtureContext);
  const lastFixtureState = useFixtureStateRef(fixtureState);
  // Keep a copy of the previous fixture state to observe changes
  const prevFixtureState = React.useRef(fixtureState);
  // Remember initial state of child components to use as a default when
  // resetting fixture state
  const initialStates = React.useRef<InitialStates>({});
  // Ref handlers are reused because every time we pass a new ref handler to
  // a React element it gets called in the next render loop, even when the
  // associated element instance has been preserved. Having ref handlers fire
  // on every render loop results in unwanted operations and race conditions.
  const cachedRefHandlers = React.useRef<CachedRefHandlers>({});

  useUnmount(() => {
    initialStates.current = {};
    cachedRefHandlers.current = {};
  });

  React.useEffect(() => {
    // Remove fixture state for removed child elements (likely via HMR)
    // FIXME: Also invalidate fixture state at this element path if the
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
          delete cachedRefHandlers.current[elPath];
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
          prevFixtureState.current,
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
  }, [children, fixtureState.classState]);

  // Update prev fixture state ref *after* running effects that reference it
  React.useEffect(() => {
    prevFixtureState.current = fixtureState;
  });

  return decorateFixtureRefs(children, handleRef, cachedRefHandlers.current);

  function handleRef(elPath: string, elRef: null | React.Component) {
    if (!elRef) {
      delete elRefs.current[elPath];
      return;
    }

    // Only track instances with state
    const { state } = elRef;
    if (!state) {
      return;
    }

    elRefs.current[elPath] = elRef;
    setInitialState(elPath, elRef);

    const elementId = { decoratorId, elPath };
    const fsClassState = findFixtureStateClassState(
      lastFixtureState.current,
      elementId
    );
    if (!fsClassState) {
      setFixtureState(prevFs => ({
        ...prevFs,
        classState: createFixtureStateClassState({
          fixtureState: prevFs,
          elementId,
          values: createValues(state)
        })
      }));
    } else {
      replaceState(elRef, extendWithValues(state, fsClassState.values));
    }
  }

  function setInitialState(elPath: string, elRef: React.Component) {
    const found = initialStates.current[elPath];
    const type = elRef.constructor as React.ComponentClass;

    // Keep the first state recevied for this type
    const initialStateExists = found && found.type === type;
    if (!initialStateExists && elRef.state) {
      initialStates.current[elPath] = { type, state: elRef.state };
    }
  }
}
