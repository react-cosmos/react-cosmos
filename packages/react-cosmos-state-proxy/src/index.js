// @flow

import React, { Component } from 'react';
import isEqual from 'lodash.isequal';
import isEmpty from 'lodash.isempty';
import omit from 'lodash.omit';

import type { ComponentRef } from 'react-cosmos-flow/react';
import type { ProxyProps } from 'react-cosmos-flow/proxy';

type Options = {
  fixtureKey?: string,
  updateInterval?: number
};

type Props = ProxyProps & {
  disableLocalState?: boolean
};

export function createStateProxy({
  fixtureKey = 'state',
  // How often to read current state of loaded component and report it up the
  // chain of proxies
  updateInterval = 500
}: Options = {}) {
  class StateProxy extends Component<Props> {
    static defaultProps = {
      // Parent proxies can enable this flag to disable this proxy
      disableLocalState: false
    };

    prevState = {};

    componentRef: ?ComponentRef;

    timeoutId: ?TimeoutID;

    componentWillUnmount() {
      this.clearTimeout();
    }

    onComponentRef = (componentRef: ?ComponentRef) => {
      // Save component ref to be able to read its state later
      this.componentRef = componentRef;

      const { fixture, onComponentRef, disableLocalState } = this.props;

      // Ref callbacks are also called on unmount with null value
      if (componentRef) {
        if (disableLocalState) {
          // Bubble up component ref
          onComponentRef(componentRef);
        } else {
          // Load initial state right after component renders
          const fixtureState = fixture[fixtureKey];
          if (fixtureState) {
            injectState(componentRef, fixtureState, () => {
              // Bubble up component ref after state has been injected
              onComponentRef(componentRef);

              this.prevState = fixtureState;
              this.scheduleStateUpdate();
            });
          } else {
            // Bubble up component ref
            onComponentRef(componentRef);

            // Only poll for state changes if component has state
            const initialState = getState(componentRef);
            if (initialState) {
              this.updateState(initialState);
            }
          }
        }
      } else {
        // Bubble up null component ref
        onComponentRef(componentRef);

        this.clearTimeout();
      }
    };

    onStateUpdate = () => {
      if (this.componentRef) {
        this.updateState(getState(this.componentRef));
      }
    };

    updateState(updatedState: Object) {
      const { onFixtureUpdate } = this.props;

      if (!isEqual(updatedState, this.prevState)) {
        this.prevState = updatedState;

        onFixtureUpdate({
          state: updatedState
        });
      }

      this.scheduleStateUpdate();
    }

    scheduleStateUpdate() {
      // TODO: Find a better way than polling to hook into state changes
      this.timeoutId = setTimeout(this.onStateUpdate, updateInterval);
    }

    clearTimeout() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
    }

    render() {
      const { props, onComponentRef } = this;
      const { nextProxy } = props;

      return React.createElement(nextProxy.value, {
        ...props,
        nextProxy: nextProxy.next(),
        onComponentRef
      });
    }
  }

  return StateProxy;
}

function injectState(component, state, cb) {
  const rootState = omit(state, 'children');

  component.setState(rootState, () => {
    const { children } = state;

    if (isEmpty(children)) {
      cb();
      return;
    }

    const { refs } = component;
    const promises = [];

    Object.keys(refs).forEach(ref => {
      const child = refs[ref];
      const childState = children[ref];

      if (!isEmpty(childState)) {
        promises.push(
          new Promise(resolve => {
            injectState(child, childState, resolve);
          })
        );
      }
    });

    if (promises.length === 0) {
      cb();
    } else {
      Promise.all(promises).then(cb);
    }
  });
}

function getState(component) {
  const { state, refs } = component;

  if (!refs) {
    return state;
  }

  const children = {};

  Object.keys(refs).forEach(ref => {
    const child = refs[ref];
    const childState = getState(child);

    if (!isEmpty(childState)) {
      children[ref] = childState;
    }
  });

  if (isEmpty(children)) {
    return state;
  }

  return {
    ...state,
    children
  };
}
