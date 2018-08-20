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

const DEFAULT_RENDER_KEY = 0;

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

// TODO: Listen and update fixture state on component state changes
class ComponentStateInner extends Component<InnerProps> {
  instance: ?ElementRef<any>;

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

  componentDidUpdate() {
    // Because of shouldComponentUpdate we can assume that fixture state
    // relevant to this instance changed
    const { instance } = this;
    if (!instance) {
      return;
    }

    const { fixtureState, state: originalState } = this.props;
    const fixtureStateState = getRelatedFixtureState(fixtureState, this);

    if (fixtureStateState) {
      // Fixture state already has data on this instance => Inject merged
      // state (...original mock, ...fixture state) into the component.
      instance.setState(
        extendOriginalStateWithFixtureState(originalState, fixtureStateState)
      );
    }
  }

  handleRef = (ref: ?ElementRef<any>) => {
    this.instance = ref;

    if (!ref) {
      return;
    }

    const { fixtureState, state: originalState } = this.props;
    const fixtureStateState = getRelatedFixtureState(fixtureState, this);

    if (fixtureStateState) {
      // Fixture context already has state for this instance => Inject merged
      // state (...original mock, ...fixture state) into the component.
      ref.setState(
        extendOriginalStateWithFixtureState(originalState, fixtureStateState)
      );
    } else if (originalState) {
      // State is mocked, but there's no fixture state yet => Populate
      // fixtureState.state with the values of the mocked state, as well as
      // (most imporantly) inject the mocked state into the component.
      ref.setState(originalState);
      this.setFixtureState(originalState, ref);
    } else if (ref.state) {
      // State isn't mocked, but component has initial state => Populate
      // fixtureState.state with component's initial state
      this.setFixtureState(ref.state, ref);
    }
  };

  setFixtureState(componentState, instance) {
    const { setFixtureState } = this.props;
    // NOTE: This assumes ref is a Class instance, something React might
    // change in the future
    const component = getComponentMetadata(instance.constructor, this);

    setFixtureState(fixtureState => {
      const stateForAllInstances = fixtureState.state || [];
      const stateForOtherInstances = stateForAllInstances.filter(
        state => state.component.instanceId !== component.instanceId
      );
      const stateForThisInstance = {
        component,
        renderKey: DEFAULT_RENDER_KEY,
        values: extractValuesFromObject(componentState)
      };

      return {
        state: [...stateForOtherInstances, stateForThisInstance]
      };
    });
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
