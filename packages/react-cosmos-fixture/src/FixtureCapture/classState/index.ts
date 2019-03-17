import * as React from 'react';
import { isEqual } from 'lodash';
import {
  FixtureDecoratorId,
  FixtureState,
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
  attachChildRefs
  // deleteRefHandler,
  // deleteRefHandlers
} from './attachChildRefs';
import { replaceState } from './replaceState';
import { ElRefs } from './shared';
import { useReadState } from './useReadState';

type InitialStates = {
  [elPath: string]: {
    type: React.ComponentClass<any>;
    // "The state [...] should be a plain JavaScript object."
    // https://reactjs.org/docs/react-component.html#state
    state: {};
  };
};

export function useClassStateCapture(
  children: React.ReactNode,
  decoratorId: FixtureDecoratorId
) {
  const { fixtureState, setFixtureState } = React.useContext(FixtureContext);
  const elPaths = findRelevantElementPaths(children);
  // Make latest fixture state accessible in hook callbacks
  const fixtureStateRef = useFixtureStateRef(fixtureState);
  // Keep a copy of the previous fixture state to observe changes
  const prevFixtureStateRef = React.useRef(fixtureState);
  const decoratorRef = React.useRef({});
  const elRefs = React.useRef<ElRefs>({});
  // Remember initial state of child components to use as a default when
  // resetting fixture state
  const initialStates = React.useRef<InitialStates>({});

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

  useReadState(decoratorId, elPaths, elRefs, fixtureStateRef);

  React.useEffect(() => {
    prevFixtureStateRef.current = fixtureState;
  });

  useCleanup(elRefs, initialStates);

  return attachChildRefs({
    node: children,
    onRef: handleRef,
    decoratorRef,
    decoratorId
  });

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
    initialStates.current[elPath] = {
      type: elRef.constructor as React.ComponentClass,
      state
    };
    // this.setElInitialState(elPath, elRef);
    //   setElInitialState(elPath: string, elRef: React.Component) {
    //     const found = this.initialStates[elPath];
    //     const type = getElementRefType(elRef);

    //     // Keep the first state recevied for this type
    //     if (found && found.type === type) {
    //       return;
    //     }

    //     const { state } = elRef;
    //     if (state) {
    //       this.initialStates[elPath] = { type, state };
    //     }
    //   }

    const elementId = { decoratorId, elPath };
    const fsClassState = findFixtureStateClassState(
      fixtureStateRef.current,
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
}

function useFixtureStateRef(fixtureState: FixtureState) {
  const fixtureStateRef = React.useRef(fixtureState);
  React.useEffect(() => {
    fixtureStateRef.current = fixtureState;
  });
  return fixtureStateRef;
}

function useCleanup(
  elRefs: React.MutableRefObject<ElRefs>,
  initialStates: React.MutableRefObject<InitialStates>
) {
  React.useEffect(
    () => () => {
      // Take out the trash
      elRefs.current = {};
      initialStates.current = {};
      // deleteRefHandlers(this);
    },
    []
  );
}
