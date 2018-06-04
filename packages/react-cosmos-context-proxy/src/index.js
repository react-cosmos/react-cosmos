// @flow

import React, { Component } from 'react';

import type { ProxyProps } from 'react-cosmos-flow/proxy';

type Options = {
  fixtureKey?: string,
  childContextTypes: {
    [string]: any // React doesn't really expose types for prop-types
  }
};

export function createContextProxy({
  fixtureKey = 'context',
  childContextTypes
}: Options) {
  class ContextProxy extends Component<ProxyProps> {
    static childContextTypes = childContextTypes;

    getChildContext() {
      return this.props.fixture[fixtureKey] || {};
    }

    render() {
      const { nextProxy, ...rest } = this.props;
      const { value: NextProxy, next } = nextProxy;

      return <NextProxy {...rest} nextProxy={next()} />;
    }
  }

  return ContextProxy;
}
