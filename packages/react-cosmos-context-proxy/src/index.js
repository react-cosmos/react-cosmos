import React, { Component } from 'react';
import { proxyPropTypes } from 'react-cosmos-shared/react';

const defaults = {
  fixtureKey: 'context'
};

export function createContextProxy(options) {
  const { fixtureKey, childContextTypes } = { ...defaults, ...options };

  class ContextProxy extends Component {
    static propTypes = proxyPropTypes;

    static childContextTypes = childContextTypes;

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

  return ContextProxy;
}
