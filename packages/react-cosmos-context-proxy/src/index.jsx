import PropTypes from 'prop-types';
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
    nextProxy: PropTypes.shape({
      value: PropTypes.func,
      next: PropTypes.func,
    }).isRequired,
    component: PropTypes.func.isRequired,
    fixture: PropTypes.object.isRequired,
    onComponentRef: PropTypes.func.isRequired,
    onFixtureUpdate: PropTypes.func.isRequired,
  };

  ContextProxy.childContextTypes = childContextTypes;

  return ContextProxy;
}
