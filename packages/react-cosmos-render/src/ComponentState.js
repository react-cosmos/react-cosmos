// @flow

import find from 'lodash/find';
import React, { Component, cloneElement } from 'react';
import { FixtureContext } from './FixtureContext';
import { CaptureProps } from './CaptureProps';
import { extractValuesFromObject } from './shared/values';
import {
  getComponentMetadata,
  getInstanceId
} from './shared/component-metadata';

import type { Element, ElementRef } from 'react';
import type { FixtureState, FixtureStateState, SetFixtureState } from './types';

type Props = {
  children: Element<any>,
  state?: Object
};

// How often to check the state of loaded component and update the fixture
// state if it changed
const REFRESH_INTERVAL = 200;

// BEWARE: this module's confusing as hell. We're juggling two types of state:
// - Fixture state: Data related to the loaded fixture (props, state, etc)
// - Component state: A part of the fixture state related to component state
// Flow types are used more than necessary in this file to decrease confusion.
export function ComponentState({ children, state }: Props) {
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

type InnerProps = Props & {
  fixtureState: FixtureState,
  setFixtureState: SetFixtureState
};

class ComponentStateInner extends Component<InnerProps> {
  childRef: ?ElementRef<any>;

  timeoutId: ?TimeoutID;

  render() {
    const { children } = this.props;

    return (
      <CaptureProps>
        {cloneElement(children, { ref: this.handleRef })}
      </CaptureProps>
    );
  }

  shouldComponentUpdate(nextProps) {
    // TODO: Return false if related fixtureState didn't change
    return nextProps.fixtureState.state !== this.props.fixtureState.state;
  }

  // Because of shouldComponentUpdate we can assume that fixture state
  // relevant to this instance changed in componentDidUpdate
  componentDidUpdate() {
    const { childRef } = this;
    if (!childRef) {
      return;
    }

    const { fixtureState, state: originalState } = this.props;
    const fixtureStateState = getRelatedFixtureState(fixtureState, this);

    if (fixtureStateState) {
      // Fixture context already has state for this instance => Inject merged
      // state (...original mock, ...fixture state) into the component.
      childRef.setState(
        extendOriginalStateWithFixtureState(originalState, fixtureStateState)
      );
    }
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  handleRef = (elRef: ?ElementRef<any>) => {
    const {
      children: { ref: prevRef },
      state: originalState
    } = this.props;

    this.childRef = elRef;

    // Call any previously defined ref from the child element
    if (prevRef) {
      prevRef(elRef);
    }

    if (!elRef) {
      return;
    }

    if (originalState) {
      // State is mocked, but there's no fixture state yet => Populate
      // fixtureState.state with the values of the mocked state, as well as
      // (most imporantly) inject the mocked state into the component.
      elRef.setState(originalState);
      this.setFixtureStateState(originalState, elRef);
    } else if (elRef.state) {
      // State isn't mocked, but component has initial state => Populate
      // fixtureState.state with component's initial state
      this.setFixtureStateState(elRef.state, elRef);
    }
  };

  setFixtureStateState(componentState, childRef) {
    const { setFixtureState } = this.props;
    // NOTE: This assumes ref is a Class instance, something React might
    // change in the future
    const component = getComponentMetadata(childRef.constructor, this);

    setFixtureState(fixtureState => {
      const stateForAllInstances = fixtureState.state || [];
      const stateForOtherInstances = stateForAllInstances.filter(
        state => state.component.instanceId !== component.instanceId
      );
      const stateForThisInstance = {
        component,
        values: extractValuesFromObject(componentState)
      };

      return {
        state: [...stateForOtherInstances, stateForThisInstance]
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

    if (this.hasComponentStateChanged()) {
      this.setFixtureStateState(childRef.state, childRef);
    } else {
      this.scheduleStateCheck();
    }
  };

  hasComponentStateChanged() {
    // TODO: Implement
    // We should probably keep a copy of the last component state
    return true;
  }
}

function getRelatedFixtureState(fixtureState, instance): ?FixtureStateState {
  if (!fixtureState.state || fixtureState.state.length === 0) {
    return null;
  }

  const instanceId = getInstanceId(instance);

  return find(
    fixtureState.state,
    state => state.component.instanceId === instanceId
  );
}

function extendOriginalStateWithFixtureState(
  originalState = {},
  fixtureStateState
) {
  if (!fixtureStateState) {
    // At this point fixtureState has state, but only related to other components
    return originalState;
  }

  const { values } = fixtureStateState;
  const mergedState = {};

  // Use latest prop value for serializable props, and fall back to original
  // value for unserializable props.
  values.forEach(({ serializable, key, value }) => {
    mergedState[key] = serializable ? value : originalState[key];
  });

  // Clear original state that was removed from fixtureState. This allows users
  // to remove state attributes defined in fixture. We need to to this because
  // React doesn't provide a replaceState method (anymore).
  // https://reactjs.org/docs/react-component.html#setstate
  Object.keys(originalState).forEach(key => {
    if (Object.keys(mergedState).indexOf(key) === -1) {
      mergedState[key] = undefined;
    }
  });

  return mergedState;
}
