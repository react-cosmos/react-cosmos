import PropTypes from 'prop-types';
import React from 'react';
import isEqual from 'lodash.isequal';
import ReactComponentTree from 'react-component-tree';

const defaults = {
  fixtureKey: 'state',
  // How often to read current state of loaded component and report it up the
  // chain of proxies
  updateInterval: 500,
};

export default function createStateProxy(options) {
  const {
    fixtureKey,
    updateInterval,
  } = { ...defaults, ...options };

  class StateProxy extends React.Component {
    constructor(props) {
      super(props);
      this.onComponentRef = this.onComponentRef.bind(this);
      this.onStateUpdate = this.onStateUpdate.bind(this);
    }

    componentWillUnmount() {
      clearTimeout(this.timeoutId);
    }

    onComponentRef(componentRef) {
      const {
        fixture,
        onComponentRef,
        disableLocalState,
      } = this.props;

      // Ref callbacks are also called on unmount with null value
      if (componentRef && !disableLocalState) {
        // Load initial state right after component renders
        const fixtureState = fixture[fixtureKey];
        if (fixtureState) {
          ReactComponentTree.injectState(componentRef, fixtureState);
          this.scheduleStateUpdate();
        } else {
          const initialState = this.getStateTree(componentRef);
          // No need to poll for state changes if entire component tree is stateless
          if (initialState) {
            this.updateState(initialState);
          }
        }
      }

      if (!componentRef) {
        clearTimeout(this.timeoutId);
      }

      // Bubble up component ref
      onComponentRef(this.componentRef = componentRef);
    }

    onStateUpdate() {
      this.updateState(this.getStateTree(this.componentRef));
    }

    getStateTree(componentRef) {
      return ReactComponentTree.serialize(componentRef).state;
    }

    updateState(updatedState) {
      const {
        fixture,
        onFixtureUpdate,
      } = this.props;

      if (!isEqual(updatedState, fixture.state)) {
        onFixtureUpdate({
          state: updatedState,
        });
      }

      this.scheduleStateUpdate();
    }

    scheduleStateUpdate() {
      // TODO: Find a better way than polling to hook into state changes
      this.timeoutId = setTimeout(this.onStateUpdate, updateInterval);
    }

    render() {
      const {
        props,
        onComponentRef,
      } = this;
      const {
        nextProxy
      } = props;

      return React.createElement(nextProxy.value, { ...props,
        nextProxy: nextProxy.next(),
        onComponentRef
      });
    }
  }

  StateProxy.defaultProps = {
    // Parent proxies can enable this flag to disable this proxy
    disableLocalState: false,
  };

  StateProxy.propTypes = {
    nextProxy: PropTypes.shape({
      value: PropTypes.func,
      next: PropTypes.func,
    }).isRequired,
    component: PropTypes.func.isRequired,
    fixture: PropTypes.object.isRequired,
    onComponentRef: PropTypes.func.isRequired,
    onFixtureUpdate: PropTypes.func.isRequired,
    disableLocalState: PropTypes.bool,
  };

  return StateProxy;
}
