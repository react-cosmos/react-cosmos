import React from 'react';
import { proxyPropTypes } from 'react-cosmos-shared';

const defaults = {
  fixtureKey: 'context'
};

export default function createContextProxy(options) {
  const { fixtureKey, childContextTypes } = { ...defaults, ...options };

  class ContextProxy extends React.Component {
    getChildContext() {
      return this.props.fixture[fixtureKey] || {};
    }

    render() {
      const { nextProxy, fixture, onComponentRef } = this.props;

      return React.createElement(nextProxy.value, {
        ...this.props,
        nextProxy: nextProxy.next(),
        fixture,
        onComponentRef
      });
    }
  }

  ContextProxy.propTypes = proxyPropTypes;

  ContextProxy.childContextTypes = childContextTypes;

  return ContextProxy;
}
