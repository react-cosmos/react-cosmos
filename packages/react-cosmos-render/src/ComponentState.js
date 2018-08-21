// @flow

import { find } from 'lodash';
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

  // Remember the child component's initial state to use as a baseline for
  // mocked state (when fixture state is empty)
  initialState = {};

  prevState: ?Object;

  render() {
    const { children } = this.props;

    return (
      <CaptureProps>
        {cloneElement(children, { ref: this.handleRef })}
      </CaptureProps>
    );
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.state !== this.props.state ||
      // TODO: Return false if related fixtureState values didn't change
      nextProps.fixtureState.state !== this.props.fixtureState.state
    );
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

    childRef.setState(
      extendOriginalStateWithFixtureState({
        initialState: this.initialState,
        currentState: childRef.state,
        mockedState,
        fixtureStateState
      })
    );
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
      this.setFixtureStateState(mockedState, childRef);
    } else if (childRef.state) {
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

    if (childRef.state !== this.prevState) {
      this.prevState = childRef.state;
      this.setFixtureStateState(childRef.state, childRef);
    } else {
      this.scheduleStateCheck();
    }
  };
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

function extendOriginalStateWithFixtureState({
  initialState,
  currentState,
  mockedState = {},
  fixtureStateState
}) {
  if (!fixtureStateState) {
    // At this point fixtureState only has state related to other components
    // Merge mocked state with initial state, but clear any extra state
    // properties added previously
    return resetOriginalProps(currentState, {
      ...initialState,
      ...mockedState
    });
  }

  const { values } = fixtureStateState;
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
