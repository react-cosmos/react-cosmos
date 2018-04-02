// @flow

import React, { Component } from 'react';
import { rootStyles, codeStyles } from './styles';

import type { ProxyProps } from 'react-cosmos-flow/proxy';

type State = {
  hasError: boolean,
  errorMessage: string
};

// Returning a class creator to be consistent with the other proxies and to be
// able to add options in the future without breaking API
export default function createErrorCatchProxy() {
  class ErrorCatchProxy extends Component<ProxyProps, State> {
    state = {
      hasError: false,
      errorMessage: ''
    };

    componentDidCatch(error: Error, info: any) {
      console.log(error, info);
      this.setState({ hasError: true, errorMessage: error.message });
    }

    render() {
      return this.state.hasError ? this.renderError() : this.renderNextProxy();
    }

    renderError() {
      return (
        <div style={rootStyles}>
          <div>
            <strong>Ouch, something wrong!</strong>
          </div>
          <div>
            <pre style={codeStyles}>{this.state.errorMessage}</pre>
          </div>
          <div>Check console for more info.</div>
        </div>
      );
    }

    renderNextProxy() {
      const { nextProxy } = this.props;
      return <nextProxy.value {...this.props} nextProxy={nextProxy.next()} />;
    }
  }

  return ErrorCatchProxy;
}
