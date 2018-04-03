import React, { Component } from 'react';
import { proxyPropTypes } from 'react-cosmos-shared/react';
import omit from 'lodash.omit';
import pick from 'lodash.pick';

const defaults = {
  notProps: ['component', 'children', 'state', 'context', 'reduxState']
};

export function createNormalizePropsProxy(options) {
  const { notProps } = { ...defaults, ...options };

  class NormalizePropsProxy extends Component {
    static propTypes = proxyPropTypes;

    render() {
      const { nextProxy, fixture } = this.props;

      return React.createElement(nextProxy.value, {
        ...this.props,
        nextProxy: nextProxy.next(),
        fixture: getFixedFixture(fixture, notProps)
      });
    }
  }

  return NormalizePropsProxy;
}

function getFixedFixture(fixture, notProps) {
  if (fixture.props) {
    // Proxy does not support partially upgraded fixture
    return fixture;
  }

  return {
    ...pick(fixture, notProps),
    props: omit(fixture, notProps)
  };
}
