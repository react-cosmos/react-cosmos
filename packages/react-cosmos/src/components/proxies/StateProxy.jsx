import React from 'react';
import omit from 'lodash.omit';
import isEqual from 'lodash.isequal';
import ReactComponentTree from 'react-component-tree';

const defaults = {
  fixtureKey: 'state',
  // How often to read current state of preview component and report it up the
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
      this.onPreviewRender = this.onPreviewRender.bind(this);
      this.onStateUpdate = this.onStateUpdate.bind(this);
    }

    componentWillUnmount() {
      clearTimeout(this.timeoutId);
    }

    onPreviewRender(previewComponent) {
      const {
        fixture,
        onPreviewRef,
        disableLocalState,
      } = this.props;

      // Ref callbacks are also called on unmount with null value. We just need
      // to make sure to bubble up the unmount call in that case.
      if (previewComponent && !disableLocalState) {
        // Load initial state right after component renders
        const fixtureState = fixture[fixtureKey];
        if (fixtureState) {
          ReactComponentTree.injectState(previewComponent, fixtureState);
          this.scheduleStateUpdate();
        } else {
          const initialState = this.getStateTree(previewComponent);
          // No need to poll for state changes if entire component tree is stateless
          if (initialState) {
            this.updateState(initialState);
          }
        }
      }

      // Bubble up preview component ref callback
      onPreviewRef(this.previewComponent = previewComponent);
    }

    onStateUpdate() {
      this.updateState(this.getStateTree(this.previewComponent));
    }

    getStateTree(previewComponent) {
      return ReactComponentTree.serialize(previewComponent).state;
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
        onPreviewRender,
      } = this;
      const {
        nextProxy,
        fixture,
        disableLocalState,
      } = props;

      // TODO: No longer omit when props will be read from fixture.props
      // https://github.com/react-cosmos/react-cosmos/issues/217
      const childFixture = disableLocalState ? fixture : omit(fixture, 'state');

      return React.createElement(nextProxy.value, { ...props,
        nextProxy: nextProxy.next(),
        fixture: childFixture,
        onPreviewRef: onPreviewRender,
      });
    }
  }

  StateProxy.defaultProps = {
    // Parent proxies can enable this flag to disable this proxy
    disableLocalState: false,
  };

  StateProxy.propTypes = {
    nextProxy: React.PropTypes.shape({
      value: React.PropTypes.func,
      next: React.PropTypes.func,
    }).isRequired,
    component: React.PropTypes.func.isRequired,
    fixture: React.PropTypes.object.isRequired,
    onPreviewRef: React.PropTypes.func.isRequired,
    onFixtureUpdate: React.PropTypes.func.isRequired,
    disableLocalState: React.PropTypes.bool,
  };

  return StateProxy;
}
