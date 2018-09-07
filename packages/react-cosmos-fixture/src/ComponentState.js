// @flow

import { isEqual } from 'lodash';
import React, { Component, cloneElement } from 'react';
import { replaceOrAddItem } from 'react-cosmos-shared2/util';
import {
  extractValuesFromObject,
  areValuesEqual,
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
  childRef: ?ElementRef<any>;

  timeoutId: ?TimeoutID;

  // Remember the child component's initial state to use as a baseline for the
  // mocked state (when fixture state is empty)
  initialState = {};

  prevState: ?Object;

  render() {
    const { children } = this.props;
    const clonedEl = cloneElement(children, { ref: this.handleRef });

    // Allow fixture decorators to opt out from their props being captured
    if (clonedEl.type.cosmosCaptureProps === false) {
      return clonedEl;
    }

    return <CaptureProps>{clonedEl}</CaptureProps>;
  }

  shouldComponentUpdate({
    children: { type: nextType },
    state: nextMockedState,
    fixtureState: nextFixtureState
  }) {
    const {
      children: { type },
      state: mockedState,
      fixtureState
    } = this.props;

    // Re-render if child type or mocked fixture changed (eg. via webpack HMR)
    if (nextType !== type || !isEqual(nextMockedState, mockedState)) {
      return true;
    }

    if (nextFixtureState === fixtureState) {
      return false;
    }

    const instanceId = getInstanceId(this);
    const next = getFixtureStateStateInst(nextFixtureState, instanceId);
    const prev = getFixtureStateStateInst(fixtureState, instanceId);

    if (next === prev) {
      return false;
    }

    // Fixture state for this instance is populated on mount, so a transition
    // to an empty state means that this instance is expected to reset
    if (!next) {
      return true;
    }

    // If the fixture state for this instance has just been populated, we need
    // to compare its values against the default values, otherwise an additional
    // render cycle will be always run on init
    const prevValues = prev
      ? prev.values
      : extractValuesFromObject(mockedState || this.initialState);

    // Because serialized fixture state changes are received remotely, a change
    // in one fixtureState.state instance will change the identity of all
    // fixtureState.state instances. So the only way to avoid useless re-renders
    // is to check if any value from the fixture state state changed.
    return !areValuesEqual(next.values, prevValues);
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

    // Reset fixture state if... x
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

    const nextState = this.extendComponentStateWithFixtureState(
      childRef,
      stateInstance
    );

    // This update might be caused by an organic state change from within the
    // wrapped component. Blindly setting the state here would result in an
    // infinite loop of state changes.
    if (!isEqual(nextState, childRef.state)) {
      childRef.setState(nextState);
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  handleRef = (childRef: ?ElementRef<any>) => {
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
      return childRef.setState(
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
      childRef.setState(mockedState);
      this.setFixtureState(mockedState, childRef);
    } else if (childRef.state) {
      // State isn't mocked, but component has initial state => Populate
      // fixture state with component's initial state
      this.setFixtureState(this.initialState, childRef);
    }
  };

  resetState(childRef) {
    const { state: mockedState } = this.props;
    const cleanState =
      // Prevent leaking previous state properties when resetting state
      resetOriginalKeys(childRef.state, {
        ...this.initialState,
        ...mockedState
      });

    childRef.setState(cleanState);
    this.setFixtureState(cleanState, childRef);
  }

  // setFixtureState receives childRef as an argument because it is called
  // from places where the existance of this.childRef has already been checked
  setFixtureState(componentState, childRef) {
    const { setFixtureState } = this.props;

    setFixtureState(fixtureState => {
      const instanceId = getInstanceId(this);
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

    if (childRef.state !== this.prevState) {
      this.prevState = childRef.state;
      this.setFixtureState(childRef.state, childRef);
    } else {
      this.scheduleStateCheck();
    }
  };

  extendComponentStateWithFixtureState(childRef, stateInstance) {
    const { state: mockedState = {} } = this.props;
    const currentState = childRef.state;

    // Use latest prop value for serializable props, and fall back to mocked
    // values for unserializable props.
    const mergedState = stateInstance.values.reduce(
      (acc, { serializable, key, value }) => ({
        ...acc,
        [key]: serializable ? value : mockedState[key]
      }),
      {}
    );

    // Only use state properties defined in fixtureState. This allows users to:
    // - Removed mocked state properties (defined in fixture)
    // - Removed initial state properties
    return resetOriginalKeys(currentState, mergedState);
  }
}

// We need to do this because React doesn't provide a replaceState method
// (anymore) https://reactjs.org/docs/react-component.html#setstate
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

function getRefType(elRef) {
  // NOTE: This assumes ref is a Class instance, something React might
  // change in the future
  return elRef.constructor;
}
