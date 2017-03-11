import React from 'react';

const defaults = {
  fixtureKey: 'context',
};

export default function createContextProxy(options) {
  const {
    fixtureKey,
    childContextTypes,
  } = { ...defaults, ...options };

  class ContextProxy extends React.Component {
    getChildContext() {
      return this.props.fixture[fixtureKey];
    }

    render() {
      const {
        nextProxy,
        fixture,
        onComponentRef,
      } = this.props;

      return React.createElement(nextProxy.value, { ...this.props,
        nextProxy: nextProxy.next(),
        fixture,
        onComponentRef,
      });
    }
  }

  ContextProxy.propTypes = {
    nextProxy: React.PropTypes.shape({
      value: React.PropTypes.func,
      next: React.PropTypes.func,
    }).isRequired,
    component: React.PropTypes.func.isRequired,
    fixture: React.PropTypes.object.isRequired,
    onComponentRef: React.PropTypes.func.isRequired,
    onFixtureUpdate: React.PropTypes.func.isRequired,
  };

  ContextProxy.childContextTypes = childContextTypes;

  return ContextProxy;
}
