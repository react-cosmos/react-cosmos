// @flow

import React, { Component } from 'react';

import type { ProxyProps } from 'react-cosmos-shared/src/react/types';

type State = {
  hasError: boolean
};

// Returning a class creator to be consistent with the other proxies and to be
// able to add options in the future without breaking API
export default function createErrorCatchProxy() {
  class ErrorCatchProxy extends Component<ProxyProps, State> {
    state = {
      hasError: false
    };

    componentDidCatch(error: Error, info: any) {
      console.log(error, info);
      this.setState({ hasError: true });
    }

    render() {
      return this.state.hasError ? this.renderError() : this.renderNextProxy();
    }

    renderError() {
      return <div>Something went wrong. Check console for errors.</div>;
    }

    renderNextProxy() {
      const { nextProxy } = this.props;
      return <nextProxy.value {...this.props} nextProxy={nextProxy.next()} />;
    }
  }

  return ErrorCatchProxy;
}
