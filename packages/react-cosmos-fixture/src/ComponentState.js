// @flow

import { isEqual } from 'lodash';
import React, { Component, cloneElement } from 'react';
import {
  replaceOrAddItem,
  extractValuesFromObject,
  areValuesEqual,
  getFixtureStateState,
  getFixtureStateStateInst
} from 'react-cosmos-shared2';
import { FixtureContext } from './FixtureContext';
import { CaptureProps } from './CaptureProps';
import { getInstanceId, getComponentName } from './shared/decorator';

import type { ElementRef } from 'react';
import type { SetState, FixtureState } from 'react-cosmos-shared2';
import type { ComponentStateProps } from '../types';

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

  shouldComponentUpdate({ fixtureState: nextFixtureState }) {
    const { fixtureState } = this.props;

    if (nextFixtureState === fixtureState) {
      return false;
    }

    const instanceId = getInstanceId(this);
    const next = getFixtureStateStateInst(nextFixtureState, instanceId);
    const prev = getFixtureStateStateInst(fixtureState, instanceId);

    if (next === prev) {
      return false;
    }

    // This step by step comparison is a bit dull, but it helps Flow understand
    // that by this point both next and prev are *not* null.
    if (!next || !prev) {
      return true;
    }

    // Because serialized fixture state changes are received remotely, a change
    // in one fixtureState.state instance will change the identity of all
    // fixtureState.state instances. So the only way to avoid useless re-renders
    // is to check if any value from the fixture state state changed.
    return !areValuesEqual(next.values, prev.values);
  }

  // Because of shouldComponentUpdate we can assume that fixture state
  // relevant to this instance changed in componentDidUpdate
  componentDidUpdate() {
    const { childRef } = this;
    if (!childRef) {
      return;
    }

    const { fixtureState, state: mockedState } = this.props;
    const instanceId = getInstanceId(this);
    const stateInstance = getFixtureStateStateInst(fixtureState, instanceId);

    if (stateInstance) {
      const nextState = extendOriginalStateWithFixtureState({
        currentState: childRef.state,
        mockedState,
        stateInstance
      });

      // This update might be caused by an organic state change from within the
      // wrapped component. Blindly setting the state here would result in an
      // infinite loop of state changes.
      if (!isEqual(nextState, childRef.state)) {
        childRef.setState(nextState);
      }
    } else {
      // We get here when the fixture state associated with this instance
      // (first populated at mount, inside handleRef) has been emptied.
      // This is a signal to reset the fixture state for this instance.
      const cleanState =
        // Prevent leaking previous state properties when resetting state
        resetOriginalProps(childRef.state, {
          ...this.initialState,
          ...mockedState
        });

      childRef.setState(cleanState);
      this.updateFixtureState(cleanState, childRef);
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
      state: mockedState
    } = this.props;

    this.childRef = childRef;

    // Call any previously defined ref from the child element
    if (prevRef) {
      prevRef(childRef);
    }

    if (!childRef) {
      return;
    }

    if (childRef.state) {
      this.initialState = childRef.state;
    }

    if (mockedState) {
      // State is mocked, but there's no fixture state yet => Populate
      // fixtureState.state with the values of the mocked state, as well as
      // (most imporantly) inject the mocked state into the component.
      childRef.setState(mockedState);
      this.updateFixtureState(mockedState, childRef);
    } else if (childRef.state) {
      // State isn't mocked, but component has initial state => Populate
      // fixtureState.state with component's initial state
      this.updateFixtureState(childRef.state, childRef);
    }
  };

  // updateFixtureState receives childRef as an argument because it is called
  // from places where the existance of this.childRef has already been checked
  updateFixtureState(componentState, childRef) {
    const { setFixtureState } = this.props;

    setFixtureState(fixtureState => {
      return updateComponentStateInFixtureState({
        fixtureState,
        componentState,
        decoratorRef: this,
        childRef
      });
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
      this.updateFixtureState(childRef.state, childRef);
    } else {
      this.scheduleStateCheck();
    }
  };
}

function extendOriginalStateWithFixtureState({
  currentState,
  mockedState = {},
  stateInstance
}) {
  const { values } = stateInstance;
  const mergedState = {};

  // Use latest prop value for serializable props, and fall back to mocked
  // values for unserializable props.
  values.forEach(({ serializable, key, value }) => {
    mergedState[key] = serializable ? value : mockedState[key];
  });

  // Only use state properties defined in fixtureState. This allows users to:
  // - Removed mocked state properties (defined in fixture)
  // - Removed initial state properties
  return resetOriginalProps(currentState, mergedState);
}

// We need to do this because React doesn't provide a replaceState method
// (anymore) https://reactjs.org/docs/react-component.html#setstate
function resetOriginalProps(original, current) {
  const { keys } = Object;

  return keys(original).reduce(
    (result, key) =>
      keys(result).indexOf(key) === -1
        ? { ...result, [key]: undefined }
        : result,
    current
  );
}

function updateComponentStateInFixtureState({
  fixtureState,
  componentState,
  decoratorRef,
  childRef
}: {
  fixtureState: ?FixtureState,
  componentState: Object,
  decoratorRef: ElementRef<typeof Component>,
  childRef: ElementRef<typeof Component>
}) {
  const instanceId = getInstanceId(decoratorRef);
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
}

function getRefType(elRef) {
  // NOTE: This assumes ref is a Class instance, something React might
  // change in the future
  return elRef.constructor;
}
