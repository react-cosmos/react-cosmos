// @flow

import React, { Component } from 'react';

import type { ProxyProps } from 'react-cosmos-shared/src/react/types';

type State = {
  hasError: boolean,
  errorMessage: string
};

const fontFamily = `'BlinkMacSystemFont', 'Lucida Grande', 'Segoe UI', Ubuntu, Cantarell, sans-serif`;

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
        <div style={{ margin: 12, fontFamily }}>
          <div>
            <strong>Ouch, something wrong!</strong>
          </div>
          <div>
            <pre
              style={{
                display: 'inline-block',
                padding: '4px 8px',
                background: 'rgba(255, 0, 0, 0.2)',
                fontFamily: 'FiraCode-Light, monospace',
                lineHeight: '1.5em',
                whiteSpace: 'pre-wrap'
              }}
            >
              {this.state.errorMessage}
            </pre>
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
