import React, { Component } from 'react';
import { bool } from 'prop-types';
import { proxyPropTypes } from 'react-cosmos-shared/lib/react';
import isEqual from 'lodash.isequal';
import isEmpty from 'lodash.isempty';
import omit from 'lodash.omit';

const injectState = (component, state, cb) => {
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
};

const getState = component => {
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
};

const defaults = {
  fixtureKey: 'state',
  // How often to read current state of loaded component and report it up the
  // chain of proxies
  updateInterval: 500
};

export default function createStateProxy(options) {
  const { fixtureKey, updateInterval } = { ...defaults, ...options };

  class StateProxy extends Component {
    componentWillUnmount() {
      this.clearTimeout();
    }

    onComponentRef = componentRef => {
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
      this.updateState(getState(this.componentRef));
    };

    updateState(updatedState) {
      const { fixture, onFixtureUpdate } = this.props;

      if (!isEqual(updatedState, fixture.state)) {
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
      clearTimeout(this.timeoutId);
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

  StateProxy.defaultProps = {
    // Parent proxies can enable this flag to disable this proxy
    disableLocalState: false
  };

  StateProxy.propTypes = {
    ...proxyPropTypes,
    disableLocalState: bool
  };

  return StateProxy;
}
