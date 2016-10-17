import React from 'react';
import ReactComponentTree from 'react-component-tree';

const defaults = {
  fixtureKey: 'state',
  // How often to read current state of preview component and report it up the
  // chain of proxies
  updateInterval: 500,
};

export default function createReactCosmosStateProxy(options) {
  const {
    fixtureKey,
    updateInterval,
  } = { ...defaults, ...options };

  class ReactCosmosStateProxy extends React.Component {
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
        previewRef,
      } = this.props;

      // Load initial state right after component renders
      const fixtureState = fixture[fixtureKey];
      if (fixtureState) {
        ReactComponentTree.injectState(previewComponent, fixtureState);
      }

      // No need to poll for state changes if component is stateless
      if (previewComponent.state) {
        this.previewComponent = previewComponent;
        this.onStateUpdate();
      }

      // Bubble up preview component ref callback
      previewRef(previewComponent);
    }

    onStateUpdate() {
      const {
        fixture,
        onFixtureUpdate,
      } = this.props;
      const currentState = ReactComponentTree.serialize(this.previewComponent);

      onFixtureUpdate({
        ...fixture,
        state: currentState,
      });

      // TODO: Find a better way than polling to hook into state changes
      this.timeoutId = setTimeout(this.onStateUpdate, updateInterval);
    }

    render() {
      const { props } = this;
      const {
        nextProxy,
      } = this.props;

      return React.createElement(nextProxy.value, { ...props,
        nextProxy: nextProxy.next(),
        previewRef: this.onPreviewRender,
      });
    }
  }

  ReactCosmosStateProxy.propTypes = {
    nextProxy: React.PropTypes.shape({
      value: React.PropTypes.func,
      next: React.PropTypes.func,
    }).isRequired,
    fixture: React.PropTypes.object.isRequired,
    previewRef: React.PropTypes.func.isRequired,
    onFixtureUpdate: React.PropTypes.func.isRequired,
  };

  return ReactCosmosStateProxy;
}
