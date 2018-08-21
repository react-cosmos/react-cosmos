// @flow

import { find, uniq } from 'lodash';
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

  // Remember the child component's initial state to know when to remove
  // properties. See extendOriginalStateWithFixtureState
  initialState = {};

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

    const { fixtureState, state: mockedState } = this.props;
    const fixtureStateState = getRelatedFixtureState(fixtureState, this);

    // TODO: Create test case that fails because state isn't updated when
    // fixture state is flushed for this instance (then remove this if)
    if (fixtureStateState) {
      // Fixture context already has state for this instance => Inject merged
      // state (...original mock, ...fixture state) into the component.
      childRef.setState(
        extendOriginalStateWithFixtureState(
          this.initialState,
          mockedState,
          fixtureStateState
        )
      );
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

    if (mockedState) {
      // State is mocked, but there's no fixture state yet => Populate
      // fixtureState.state with the values of the mocked state, as well as
      // (most imporantly) inject the mocked state into the component.
      childRef.setState(mockedState);
      this.setFixtureStateState(mockedState, childRef);
    } else if (childRef.state) {
      this.initialState = childRef.state;
      // State isn't mocked, but component has initial state => Populate
      // fixtureState.state with component's initial state
      this.setFixtureStateState(childRef.state, childRef);
    }
  };

  // This method receives childRef as an argument because it is called from
  // places where the existance of this.childRef has already been checked
  setFixtureStateState(componentState, childRef) {
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

function getRelatedFixtureState(
  fixtureState,
  decoratorRef
): ?FixtureStateState {
  if (!fixtureState.state || fixtureState.state.length === 0) {
    return null;
  }

  const instanceId = getInstanceId(decoratorRef);

  return find(
    fixtureState.state,
    state => state.component.instanceId === instanceId
  );
}

function extendOriginalStateWithFixtureState(
  initialState,
  mockedState = {},
  relatedFixtureState
) {
  if (!relatedFixtureState) {
    // At this point fixtureState only has state related to other components
    return mockedState;
  }

  const { values } = relatedFixtureState;
  const mergedState = {};

  // Use latest prop value for serializable props, and fall back to original
  // value for unserializable props.
  values.forEach(({ serializable, key, value }) => {
    mergedState[key] = serializable ? value : mockedState[key];
  });

  // Clear original state that was removed from fixtureState. This allows users
  // to remove state attributes defined in fixture. We need to to this because
  // React doesn't provide a replaceState method (anymore).
  // https://reactjs.org/docs/react-component.html#setstate
  const { keys } = Object;
  const allKeys = uniq([...keys(initialState), ...keys(mockedState)]);

  allKeys.forEach(key => {
    if (keys(mergedState).indexOf(key) === -1) {
      mergedState[key] = undefined;
    }
  });

  return mergedState;
}

function updateComponentStateInFixtureState({
  fixtureState,
  componentState,
  decoratorRef,
  childRef
}: {
  fixtureState: FixtureState,
  componentState: Object,
  decoratorRef: ElementRef<typeof Component>,
  childRef: ElementRef<typeof Component>
}) {
  const component = getComponentMetadata(getRefType(childRef), decoratorRef);
  const allComponentState = fixtureState.state || [];
  const otherComponentStates = allComponentState.filter(
    createComponentStateMatcher(component)
  );

  return {
    state: [
      ...otherComponentStates,
      {
        component,
        values: extractValuesFromObject(componentState)
      }
    ]
  };
}

function getRefType(elRef) {
  // NOTE: This assumes ref is a Class instance, something React might
  // change in the future
  return elRef.constructor;
}

function createComponentStateMatcher(component) {
  return state => state.component.instanceId !== component.instanceId;
}
