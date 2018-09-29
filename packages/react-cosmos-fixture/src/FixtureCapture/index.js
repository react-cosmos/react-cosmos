// @flow

import { isEqual } from 'lodash';
import React, { Component } from 'react';
import { removeItemMatch } from 'react-cosmos-shared2/util';
import {
  extractValuesFromObj,
  extendObjWithValues,
  getCompFixtureStates,
  findCompFixtureState,
  createCompFixtureState,
  updateCompFixtureState
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from '../FixtureContext';
import {
  getElementAtPath,
  getExpectedElementAtPath,
  areChildrenEqual
} from './childrenTree';
import { getDecoratorId } from './getDecoratorId';
import { getComponentName } from './getComponentName';
import { getElementRefType } from './getElementRefType';
import { findRelevantElementPaths } from './findRelevantElementPaths';
import { extendChildPropsWithFixtureState } from './extendChildPropsWithFixtureState';
import {
  attachChildRefs,
  deleteRefHandler,
  deleteRefHandlers
} from './attachChildRefs';
import { replaceState } from './replaceState';

import type { SetState } from 'react-cosmos-shared2/util';
import type {
  FixtureStateValues,
  FixtureState
} from 'react-cosmos-shared2/fixtureState';
import type { FixtureCaptureProps } from '../index.js.flow';
import type { ComponentRef } from './shared';

export function FixtureCapture({ children }: FixtureCaptureProps) {
  return (
    <FixtureContext.Consumer>
      {({ fixtureState, setFixtureState }) => (
        <FixtureCaptureInner
          fixtureState={fixtureState}
          setFixtureState={setFixtureState}
        >
          {children}
        </FixtureCaptureInner>
      )}
    </FixtureContext.Consumer>
  );
}

type InnerProps = FixtureCaptureProps & {
  fixtureState: null | FixtureState,
  setFixtureState: SetState<FixtureState>
};

// How often to check the state of the loaded component and update the fixture
// state if it changed
const REFRESH_INTERVAL = 200;

class FixtureCaptureInner extends Component<InnerProps> {
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
    const { children, fixtureState } = this.props;
    const decoratorId = this.getDecoratorId();

    return attachChildRefs(
      extendChildPropsWithFixtureState(children, fixtureState, decoratorId),
      this.handleRef,
      decoratorId
    );
  }

  componentDidMount() {
    this.scheduleStateCheck();
  }

  componentWillUnmount() {
    // Remove fixture state related to this decorator
    this.removeFixtureState();

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Take out the trash
    this.elRefs = {};
    this.initialStates = {};
    deleteRefHandlers(this.getDecoratorId());
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

    const decoratorId = this.getDecoratorId();

    // No need to update unless children and/or fixture state values changed.
    return !isEqual(
      getCompFixtureStates(nextProps.fixtureState, decoratorId),
      getCompFixtureStates(fixtureState, decoratorId)
    );
  }

  componentDidUpdate(prevProps) {
    const { children, fixtureState } = this.props;
    const elPaths = findRelevantElementPaths(children);
    const decoratorId = this.getDecoratorId();

    // Remove fixture state for removed child elements (likely via HMR)
    const compFxStates = getCompFixtureStates(fixtureState, decoratorId);
    compFxStates.forEach(({ elPath }) => {
      if (elPaths.indexOf(elPath) === -1) {
        this.removeFixtureState(elPath);
        this.flushEl(elPath);
      }
    });

    // Update fixture state and component state at remaining child paths
    elPaths.forEach(elPath => {
      const elRef = this.elRefs[elPath];

      if (!elRef) {
        // The el ref is missing when child components unmount and compDidUpdate
        // is called before the new children mount. When this happens, the new
        // children will be handled when their refs fire
        return;
      }

      const compFxState = findCompFixtureState(
        fixtureState,
        decoratorId,
        elPath
      );

      if (!compFxState) {
        return this.createFixtureState(elPath, elRef);
      }

      this.transitionElProps({ elPath, compFxState, prevProps });
      this.transitionElState({ elPath, elRef, compFxState, prevProps });
    });
  }

  transitionElProps({ elPath, compFxState, prevProps }) {
    const { children } = this.props;
    const childEl = getExpectedElementAtPath(children, elPath);

    // Reset props fixture state when...
    if (
      // a) the props fixture state for this element have been emptied
      // deliberately. Happens when user discards the fixture state to reload
      // the fixture.
      !compFxState.props ||
      // b) mocked props from fixture elemented changed (likely via HMR).
      !areChildrenEqual(childEl, getElementAtPath(prevProps.children, elPath))
    ) {
      this.updateFixtureState(elPath, {
        props: extractValuesFromObj(childEl.props)
      });
    }
  }

  transitionElState({
    elPath,
    elRef,
    compFxState: { state: stateFxState },
    prevProps
  }) {
    if (!stateFxState) {
      return this.resetState(elPath, elRef);
    }

    // The child's state can be out of sync with the fixture state for two
    // reasons:
    //   1. The child's state changed internally
    //   2. The fixture state changed
    // Here we're interested in the second scenario. In the first scenario
    // we want to let the component state override the fixture state.
    const prevCompFxState = findCompFixtureState(
      prevProps.fixtureState,
      this.getDecoratorId(),
      elPath
    );
    if (prevCompFxState && !isEqual(prevCompFxState.state, stateFxState)) {
      return replaceState(
        elRef,
        extendObjWithValues(elRef.state, stateFxState)
      );
    }
  }

  createFixtureState(elPath, elRef) {
    const { children, setFixtureState } = this.props;
    const decoratorId = this.getDecoratorId();
    const { type, props } = getExpectedElementAtPath(children, elPath);
    const componentName = getComponentName(type);
    const { state } = elRef;

    // Use state updater callback to ensure concurrent setFixtureState calls
    // don't cancel out each other.
    setFixtureState(fixtureState => ({
      components: createCompFixtureState({
        fixtureState,
        decoratorId,
        elPath,
        componentName,
        props: extractValuesFromObj(props),
        state: state ? extractValuesFromObj(state) : null
      })
    }));
  }

  updateFixtureState(
    elPath,
    update: $Shape<{
      props: null | FixtureStateValues,
      state: null | FixtureStateValues
    }>
  ) {
    const { setFixtureState } = this.props;
    const decoratorId = this.getDecoratorId();

    // Make method await-able
    return new Promise(res => {
      // Use state updater callback to ensure concurrent setFixtureState calls
      // don't cancel out each other.
      setFixtureState(
        fixtureState => ({
          components: updateCompFixtureState({
            fixtureState,
            decoratorId,
            elPath,
            ...update
          })
        }),
        res
      );
    });
  }

  removeFixtureState(elPath?: string) {
    const { setFixtureState } = this.props;
    const decoratorId = this.getDecoratorId();
    const matcher = elPath
      ? s => s.decoratorId === decoratorId && s.elPath === elPath
      : s => s.decoratorId === decoratorId;

    // Use state updater callback to ensure concurrent setFixtureState calls
    // don't cancel out each other.
    setFixtureState(fixtureState => {
      return {
        components: removeItemMatch(getCompFixtureStates(fixtureState), matcher)
      };
    });
  }

  handleRef = (elPath: string, elRef: ?ComponentRef) => {
    if (!elRef) {
      delete this.elRefs[elPath];

      return;
    }

    this.elRefs[elPath] = elRef;
    this.setElInitialState(elPath, elRef);

    const { fixtureState } = this.props;
    const decoratorId = this.getDecoratorId();
    const compFxState = findCompFixtureState(fixtureState, decoratorId, elPath);

    if (compFxState && compFxState.state) {
      replaceState(elRef, extendObjWithValues(elRef.state, compFxState.state));
    } else {
      this.createFixtureState(elPath, elRef);
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

    // Only track state in fixture state for stateful components #mountful
    if (state) {
      replaceState(elRef, state, () => {
        this.updateFixtureState(elPath, { state: extractValuesFromObj(state) });
      });
    }
  }

  scheduleStateCheck = () => {
    // Is there a better way to listen to component state changes?
    this.timeoutId = setTimeout(this.checkState, REFRESH_INTERVAL);
  };

  checkState = async () => {
    const { children, fixtureState } = this.props;
    const elPaths = findRelevantElementPaths(children);
    const decoratorId = this.getDecoratorId();

    await Promise.all(
      Object.keys(this.elRefs).map(async elPath => {
        if (elPaths.indexOf(elPath) === -1) {
          throw new Error(
            `[FixtureCapture] Child ref exists for missing element path "${elPath}"`
          );
        }

        const { state } = this.elRefs[elPath];

        if (
          state &&
          !isFixtureStateInSyncWithState(
            state,
            findCompFixtureState(fixtureState, decoratorId, elPath)
          )
        ) {
          await this.updateFixtureState(elPath, {
            state: extractValuesFromObj(state)
          });
        }
      })
    );

    // Schedule next check after all setters have been fulfilled
    this.scheduleStateCheck();
  };

  flushEl(elPath) {
    delete this.elRefs[elPath];
    delete this.initialStates[elPath];
    deleteRefHandler(this.getDecoratorId(), elPath);
  }

  getDecoratorId() {
    return getDecoratorId(this);
  }
}

function isFixtureStateInSyncWithState(state, compFxState) {
  return (
    compFxState &&
    compFxState.state &&
    isEqual(state, extendObjWithValues(state, compFxState.state))
  );
}
