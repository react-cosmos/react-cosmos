import React, { Component } from 'react';
import proxyPropTypes from 'react-cosmos-utils/lib/proxy-prop-types';

const defaults = {
  fixtureKey: 'fetch',
};

export default function createFetchProxy(options) {
  const { fixtureKey } = { ...defaults, ...options };

  class FetchProxy extends Component {
    constructor(props) {
      super(props);

      // TODO Mock window.fetch
      console.log(props.fixture[fixtureKey]);
    }

    componentWillUnmount() {
      // TODO Unmock window.fetch
    }

    render() {
      const { props } = this;
      const { nextProxy, onComponentRef } = props;

      return React.createElement(nextProxy.value, {
        ...props,
        nextProxy: nextProxy.next(),
        onComponentRef,
      });
    }
  }

  FetchProxy.propTypes = {
    ...proxyPropTypes,
  };

  return FetchProxy;
}
