// @flow

import React, { Component } from 'react';
import omit from 'lodash.omit';
import pick from 'lodash.pick';

import type { ProxyProps } from 'react-cosmos-flow/proxy';

type Options = {
  fixtureKey?: string,
  notProps?: Array<string>
};

export function createNormalizePropsProxy({
  notProps = ['component', 'children', 'state', 'context', 'reduxState']
}: Options = {}) {
  class NormalizePropsProxy extends Component<ProxyProps> {
    render() {
      const { nextProxy, fixture, ...rest } = this.props;
      const { value: NextProxy, next } = nextProxy;

      return (
        <NextProxy
          {...rest}
          nextProxy={next()}
          fixture={getFixedFixture(fixture, notProps)}
        />
      );
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
