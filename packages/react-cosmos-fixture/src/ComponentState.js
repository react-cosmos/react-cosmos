// @flow

import { isEqual } from 'lodash';
import React, { Component, cloneElement } from 'react';
import { replaceOrAddItem, removeItemMatch } from 'react-cosmos-shared2/util';
import {
  extractValuesFromObject,
  getFixtureStateState,
  getFixtureStateStateInst
} from 'react-cosmos-shared2/fixtureState';
import { FixtureContext } from './FixtureContext';
import { CaptureProps } from './CaptureProps';
import { getInstanceId, getComponentName } from './shared/decorator';

import type { ElementRef } from 'react';
import type { SetState } from 'react-cosmos-shared2/util';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { ComponentStateProps } from './index.js.flow';

// How often to check the state of the loaded component and update the fixture
// state if it changed
const REFRESH_INTERVAL = 200;

// BEWARE: this module's confusing as hell. We're juggling two types of state:
// - Fixture state: Data related to the loaded fixture (props, state, etc)
// - Component state: A part of the fixture state related to component state
// Flow types are used more than necessary in this file to decrease confusion.
export function ComponentState({ children, state }: ComponentStateProps) {
  return (
    <FixtureContext.Consumer>
      {({ fixtureState, setFixtureState }) => (
        <ComponentStateInner
          state={state}
          fixtureState={fixtureState}
          setFixtureState={setFixtureState}
        >
          {children}
        </ComponentStateInner>
      )}
    </FixtureContext.Consumer>
  );
}

ComponentState.cosmosCaptureProps = false;

type InnerProps = ComponentStateProps & {
  fixtureState: ?FixtureState,
  setFixtureState: SetState<FixtureState>
};

class ComponentStateInner extends Component<InnerProps> {
  childRef: ?ElementRef<typeof Component>;

  timeoutId: ?TimeoutID;

  // Remember the child component's initial state to use as a baseline for the
  // mocked state (when fixture state is empty)
  initialState = {};

  prevState: ?Object;

  render() {
    const { children } = this.props;

    // Flow users will get a static error when trying to wrap more elements
    // inside ComponentState. But the rest might miss this restriction and
    // find out at run time.
    if (Array.isArray(children)) {
      throw new Error('ComponentState only accepts a single child element');
    }

    const clonedEl = cloneElement(children, { ref: this.handleRef });

    // Allow fixture decorators to opt out from their props being captured
    if (clonedEl.type.cosmosCaptureProps === false) {
      return clonedEl;
    }

    return <CaptureProps>{clonedEl}</CaptureProps>;
  }

  shouldComponentUpdate({
    children: nextChildren,
    state: nextMockedState,
    fixtureState: nextFixtureState
  }) {
    const { children, state: mockedState, fixtureState } = this.props;

    // Re-render if child type or props changed (eg. via webpack HMR)
    if (
      !isEqual(nextChildren, children) ||
      !isEqual(nextMockedState, mockedState)
    ) {
      return true;
    }

    if (nextFixtureState === fixtureState) {
      return false;
    }

    const instanceId = getInstanceId(this);
    const next = getFixtureStateStateInst(nextFixtureState, instanceId);
    const prev = getFixtureStateStateInst(fixtureState, instanceId);

    // Deeper comparisons are made in componentDidUpdate to avoid redundant
    // setState calls to child ref
    return next !== prev;
  }

  // Because of shouldComponentUpdate we can assume that fixture state
  // relevant to this instance changed in componentDidUpdate
  componentDidUpdate({ state: prevMockedState }) {
    const { childRef } = this;
    if (!childRef) {
      return;
    }

    const { fixtureState, state: mockedState } = this.props;
    const instanceId = getInstanceId(this);
    const stateInstance = getFixtureStateStateInst(fixtureState, instanceId);

    // Reset fixture state if...
    if (
      // ...the fixture state associated with this instance (initially created
      // in handleRef) has been emptied deliberately. This is an edge case that
      // occurs when a user interacting with a fixture desires to discard the
      // current fixture state and load the fixture from scatch.
      !stateInstance ||
      // ...mocked state from fixture element changed, likely via webpack HMR.
      !isEqual(mockedState, prevMockedState)
    ) {
      return this.resetState(childRef);
    }

    this.replaceState(
      childRef,
      this.extendComponentStateWithFixtureState(childRef, stateInstance)
    );
  }

  componentWillUnmount() {
    const { setFixtureState } = this.props;
    const instanceId = getInstanceId(this);

    // Remove corresponding fixture state
    setFixtureState(fixtureState => {
      return {
        state: removeItemMatch(
          getFixtureStateState(fixtureState),
          state => state.instanceId === instanceId
        )
      };
    });

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  handleRef = (childRef: ?ElementRef<typeof Component>) => {
    const {
      children: { ref: prevRef },
      state: mockedState,
      fixtureState
    } = this.props;

    this.childRef = childRef;

    // Call any previously defined ref from the child element
    if (prevRef) {
      prevRef(childRef);
    }

    if (!childRef) {
      return;
    }

    const instanceId = getInstanceId(this);
    const stateInstance = getFixtureStateStateInst(fixtureState, instanceId);

    // Fixture state already exists for this instance, which means that this
    // isn't the first child ref. The child type has likely been replaced
    // (eg. via webpack HMR). Conversely, the child instance might reset due
    // to resetting the renderKey in CaptureProps. Regardless, apply the
    // fixture state to the new child instance.
    if (stateInstance) {
      return this.replaceState(
        childRef,
        this.extendComponentStateWithFixtureState(childRef, stateInstance)
      );
    }

    if (childRef.state) {
      this.initialState = childRef.state;
    }

    if (mockedState) {
      // State is mocked, but there's no fixture state yet => Populate
      // fixtureState.state with the values of the mocked state, as well as
      // (most imporantly) inject the mocked state into the component.
      this.replaceState(childRef, mockedState);
      this.setFixtureState(mockedState, childRef);
    } else if (childRef.state) {
      // State isn't mocked, but component has initial state => Populate
      // fixture state with component's initial state
      this.setFixtureState(childRef.state, childRef);
    }
  };

  // We need to do this because React doesn't provide a replaceState method
  // (anymore) https://reactjs.org/docs/react-component.html#setstate
  replaceState(childRef, nextState) {
    const fullState = resetOriginalKeys(childRef.state, nextState);

    if (!isEqual(fullState, childRef.state)) {
      childRef.setState(fullState);
    }
  }

  resetState(childRef) {
    const { state: mockedState } = this.props;
    const initialState = mockedState || this.initialState;

    this.replaceState(childRef, initialState);
    this.setFixtureState(initialState, childRef);
  }

  // setFixtureState receives childRef as an argument because it is called
  // from places where the existance of this.childRef has already been checked
  setFixtureState(componentState, childRef) {
    const { setFixtureState } = this.props;
    setFixtureState(fixtureState => {
      const instanceId = getInstanceId(this);
      (childRef: ElementRef<typeof Component>);
      const componentName = getComponentName(getRefType(childRef));
      const stateInstance = {
        instanceId,
        componentName,
        values: extractValuesFromObject(componentState)
      };

      return {
        state: replaceOrAddItem(
          getFixtureStateState(fixtureState),
          state => state.instanceId === instanceId,
          stateInstance
        )
      };
    }, this.scheduleStateCheck);
  }

  scheduleStateCheck = () => {
    // Is there a better way to listen to component state changes?
    this.timeoutId = setTimeout(this.checkState, REFRESH_INTERVAL);
  };

  checkState = () => {
    const { childRef } = this;
    if (!childRef) {
      return;
    }

    const currState = childRef.state || {};
    if (!isEqual(currState, this.prevState)) {
      this.prevState = currState;
      this.setFixtureState(currState, childRef);
    } else {
      this.scheduleStateCheck();
    }
  };

  extendComponentStateWithFixtureState(childRef, stateInstance) {
    const { state: mockedState = {} } = this.props;

    // Use latest prop value for serializable props, and fall back to mocked
    // values for unserializable props.
    return stateInstance.values.reduce(
      (acc, { serializable, key, stringified }) => ({
        ...acc,
        [key]: serializable ? JSON.parse(stringified) : mockedState[key]
      }),
      {}
    );
  }
}

function resetOriginalKeys(original, current) {
  const { keys } = Object;

  return keys(original).reduce(
    (result, key) =>
      keys(result).indexOf(key) === -1
        ? { ...result, [key]: undefined }
        : result,
    current
  );
}

function getRefType(
  elRef: ElementRef<typeof Component>
): Class<Component<any>> {
  // NOTE: This assumes ref is a Class instance, something React might
  // change in the future
  return elRef.constructor;
}
