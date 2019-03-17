import * as React from 'react';
import {
  FixtureDecoratorId,
  FixtureState,
  createValues,
  extendWithValues,
  findFixtureStateClassState,
  createFixtureStateClassState
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../../FixtureContext';
import {
  attachChildRefs
  // deleteRefHandler,
  // deleteRefHandlers
} from './attachChildRefs';
import { replaceState } from './replaceState';
import { ElRefs, InitialStates } from './shared';
import { useFixtureState } from './useFixtureState';
import { useReadClassState } from './useReadClassState';
import { useCleanup } from './useCleanup';

export function useClassStateCapture(
  children: React.ReactNode,
  decoratorId: FixtureDecoratorId
) {
  const { fixtureState, setFixtureState } = React.useContext(FixtureContext);
  // Make latest fixture state accessible in hook callbacks
  const fixtureStateRef = useFixtureStateRef(fixtureState);
  const decoratorRef = React.useRef({});
  const elRefs = React.useRef<ElRefs>({});
  // Remember initial state of child components to use as a default when
  // resetting fixture state
  const initialStates = React.useRef<InitialStates>({});

  useFixtureState(children, decoratorId, elRefs, initialStates);
  useReadClassState(children, decoratorId, elRefs, fixtureStateRef);
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
