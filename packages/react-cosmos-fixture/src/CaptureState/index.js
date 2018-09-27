// @flow

import { isEqual, find } from 'lodash';
import React, { Component, cloneElement } from 'react';
import { replaceOrAddItem, removeItemMatch } from 'react-cosmos-shared2/util';
import {
  extractValuesFromObject,
  extendObjectWithValues,
  getStateFixtureState,
  createFxStateMatcher,
  createElFxStateMatcher
} from 'react-cosmos-shared2/fixtureState';
import { getDecoratorId } from '../shared/decorator';
import { getComponentName } from '../shared/getComponentName';
import { setElementAtPath, areChildrenEqual } from '../shared/childrenTree';
import { FixtureContext } from '../FixtureContext';
import { compose } from './compose';
import { getElementRefType } from './getElementRefType';
import { createRefHandler } from './createRefHandler';
import { findRelevantElementPaths } from './findRelevantElementPaths';
import { replaceState } from './replaceState';

import type { Ref, ElementRef } from 'react';
import type { SetState } from 'react-cosmos-shared2/util';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { Children } from '../shared/childrenTree';
import type { CaptureStateProps } from '../index.js.flow';

// How often to check the state of the loaded component and update the fixture
// state if it changed
const REFRESH_INTERVAL = 200;

// BEWARE: this module can be confusing. We're juggling more types of state:
// - Component state
// - Fixture state: Data related to the loaded fixture (props, state, etc)
// - State fixture state: Part of the fixture state related to component state
export function CaptureState({ children }: CaptureStateProps) {
  return (
    <FixtureContext.Consumer>
      {({ fixtureState, setFixtureState }) => (
        <CaptureStateInner
          fixtureState={fixtureState}
          setFixtureState={setFixtureState}
        >
          {children}
        </CaptureStateInner>
      )}
    </FixtureContext.Consumer>
  );
}

CaptureState.cosmosCaptureProps = false;

type InnerProps = CaptureStateProps & {
  fixtureState: ?FixtureState,
  setFixtureState: SetState<FixtureState>
};

type ComponentRef = ElementRef<typeof Component>;

class CaptureStateInner extends Component<InnerProps> {
  // Ref handlers are reused because every time we pass a new ref handler to
  // a React element it gets called in the next render loop, even when the
  // associated element instance has been preserved. Having ref handlers fire
  // on every render loop results in unwanted operations and race conditions.
  elRefHandlers: {
    [elPath: string]: {
      origRef: ?Ref<any>,
      handler: (elRef: ?ComponentRef) => mixed
    }
  } = {};

  elRefs: {
    [elPath: string]: ComponentRef
  } = {};

  // Remember initial state of child components to use as a default when
  // resetting fixture state
  initialStates: {
    [elPath: string]: {
      type: Class<Component<any>>,
      state: {}
    }
  } = {};

  timeoutId: ?TimeoutID;

  render() {
    const { children } = this.props;

    return attachRefsToChildren(children, this.getElRefHandler);
  }

  componentDidMount() {
    this.scheduleStateCheck();
  }

  componentWillUnmount() {
    const { fixtureState } = this.props;

    // Remove corresponding fixture state
    if (fixtureState && fixtureState.state) {
      this.removeFixtureState();
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Take out the trash
    this.elRefs = {};
    this.elRefHandlers = {};
    this.initialStates = {};
  }

  shouldComponentUpdate(nextProps) {
    const { children, fixtureState } = this.props;

    // Children change when the fixture is updated at runtime (eg. via HMR)
    if (!areChildrenEqual(nextProps.children, children)) {
      return true;
    }

    // Quick identity check first
    if (nextProps.fixtureState === fixtureState) {
      return false;
    }

    const decoratorId = getDecoratorId(this);
    const matcher = createFxStateMatcher(decoratorId);

    // No need to update unless children and/or fixture state values changed.
    return !isEqual(
      getStateFixtureState(nextProps.fixtureState, matcher),
      getStateFixtureState(fixtureState, matcher)
    );
  }

  componentDidUpdate(prevProps) {
    const { children, fixtureState } = this.props;
    const elPaths = findRelevantElementPaths(children);

    const decoratorId = getDecoratorId(this);
    const decoratorMatcher = createFxStateMatcher(decoratorId);
    const stateFxStates = getStateFixtureState(fixtureState, decoratorMatcher);

    // Remove fixture state for removed child elements (likely via HMR).
    stateFxStates.forEach(({ elPath }) => {
      if (elPaths.indexOf(elPath) === -1) {
        this.removeFixtureState(elPath);
        this.flushEl(elPath);
      }
    });

    // Update fixture state for existing child paths
    elPaths.map(elPath => {
      const stateFxState = find(stateFxStates, i => i.elPath === elPath);
      const elRef = this.elRefs[elPath];

      if (!elRef) {
        // Edge-case: The el ref is missing when child components unmounts and
        // Capture.componentDidUpdate is called before child remounts. If this
        // happens, the relevant fixture state will be applied when child ref
        // is called.
        return;
      }

      // The fixture state for this element has been emptied deliberately.
      // Happens when user discards the fixture state to reload the fixture.
      if (!stateFxState) {
        return this.resetState(elPath, elRef);
      }

      // The child's state can be out of sync with the fixture state for two
      // reasons:
      //   1. The child's state changed internally
      //   2. The fixture state changed
      // Here we're interested in the second scenario. In the first scenario
      // we want to let the component state override the fixture state.
      const [prevStateFxState] = getStateFixtureState(
        prevProps.fixtureState,
        createElFxStateMatcher(decoratorId, elPath)
      );
      if (prevStateFxState && !isEqual(prevStateFxState, stateFxState)) {
        replaceState(
          elRef,
          extendObjectWithValues(elRef.state, stateFxState.values)
        );
      }
    });
  }

  // Attach ref while still honoring original ref
  getElRefHandler = (elPath, origRef) => {
    const found = this.elRefHandlers[elPath];

    if (found && found.origRef === origRef) {
      return found.handler;
    }

    const rootHandler = this.createElRefHandler(elPath);
    const handler = origRef
      ? compose(
          rootHandler,
          createRefHandler(origRef)
        )
      : rootHandler;

    this.elRefHandlers[elPath] = { origRef, handler };

    return handler;
  };

  createElRefHandler = (elPath: string) => (
    elRef: ?ElementRef<typeof Component>
  ) => {
    if (!elRef) {
      delete this.elRefs[elPath];

      return;
    }

    this.elRefs[elPath] = elRef;
    this.setElInitialState(elPath, elRef);

    const { fixtureState } = this.props;
    const decoratorId = getDecoratorId(this);
    const [stateFxState] = getStateFixtureState(
      fixtureState,
      createElFxStateMatcher(decoratorId, elPath)
    );

    if (stateFxState) {
      replaceState(
        elRef,
        extendObjectWithValues(elRef.state, stateFxState.values)
      );
    } else {
      this.replaceOrAddFixtureState(elPath);
    }
  };

  getElInitialState(elPath, elRef) {
    const found = this.initialStates[elPath];
    const type = getElementRefType(elRef);

    return found && found.type === type ? found.state : null;
  }

  setElInitialState(elPath, elRef) {
    if (this.getElInitialState(elPath, elRef)) {
      return;
    }

    const type = getElementRefType(elRef);
    const { state } = elRef;

    if (state) {
      this.initialStates[elPath] = { type, state };
    }
  }

  resetState(elPath, elRef) {
    const state = this.getElInitialState(elPath, elRef);

    // Don't track fixture state for stateless component
    if (!state) {
      return;
    }

    replaceState(elRef, state, () => {
      this.replaceOrAddFixtureState(elPath);
    });
  }

  replaceOrAddFixtureState(elPath) {
    const elRef = this.elRefs[elPath];
    if (!elRef) {
      throw new Error(`[CaptureState] Child element missing path "${elPath}"`);
    }

    // Only stateful components will generate state-related fixture state
    const { state } = elRef;
    if (!state) {
      return;
    }

    // Make method await-able
    return new Promise(res => {
      const { setFixtureState } = this.props;
      const decoratorId = getDecoratorId(this);
      const componentName = getComponentName(getElementRefType(elRef));

      // Use state updater callback to ensure concurrent setFixtureState calls
      // don't cancel out each other.
      setFixtureState(fixtureState => {
        const stateFxState = {
          decoratorId,
          elPath,
          componentName,
          values: extractValuesFromObject(state)
        };

        return {
          state: replaceOrAddItem(
            getStateFixtureState(fixtureState),
            createElFxStateMatcher(decoratorId, elPath),
            stateFxState
          )
        };
      }, res);
    });
  }

  removeFixtureState(elPath?: string) {
    const { setFixtureState } = this.props;
    const decoratorId = getDecoratorId(this);
    const matcher = elPath
      ? createElFxStateMatcher(decoratorId, elPath)
      : createFxStateMatcher(decoratorId);

    // Use state updater callback to ensure concurrent setFixtureState calls
    // don't cancel out each other.
    setFixtureState(fixtureState => {
      return {
        state: removeItemMatch(getStateFixtureState(fixtureState), matcher)
      };
    });
  }

  scheduleStateCheck = () => {
    // Is there a better way to listen to component state changes?
    this.timeoutId = setTimeout(this.checkState, REFRESH_INTERVAL);
  };

  checkState = async () => {
    const { children, fixtureState } = this.props;
    const elPaths = findRelevantElementPaths(children);
    const decoratorId = getDecoratorId(this);

    await Promise.all(
      Object.keys(this.elRefs).map(async elPath => {
        if (elPaths.indexOf(elPath) === -1) {
          throw new Error(`Child ref has missing element path "${elPath}"`);
        }

        const elRef = this.elRefs[elPath];
        const [stateFxState] = getStateFixtureState(
          fixtureState,
          createElFxStateMatcher(decoratorId, elPath)
        );

        if (!isFixtureStateInSyncWithState(elRef.state, stateFxState)) {
          await this.replaceOrAddFixtureState(elPath);
        }
      })
    );

    // Schedule next check after all setters have been fulfilled
    this.scheduleStateCheck();
  };

  flushEl(elPath) {
    delete this.elRefs[elPath];
    delete this.elRefHandlers[elPath];
    delete this.initialStates[elPath];
  }
}

function attachRefsToChildren(children, getElRefHandler) {
  const elPaths = findRelevantElementPaths(children);

  return elPaths.reduce((extendedChildren, elPath): Children => {
    return setElementAtPath(extendedChildren, elPath, element => {
      return cloneElement(element, {
        ref: getElRefHandler(elPath, element.ref)
      });
    });
  }, children);
}

function isFixtureStateInSyncWithState(state, stateFxState) {
  return (
    stateFxState &&
    isEqual(state, extendObjectWithValues(state, stateFxState.values))
  );
}
