import React, { Component } from 'react';
import { proxyPropTypes } from 'react-cosmos-shared';

// Returning a class creator to be consistent with the other proxies and to be
// able to add options in the future without breaking API
export default function createErrorCatchProxy() {
  class ErrorCatchProxy extends Component {
    state = {
      hasError: false
    };

    componentDidCatch(error, info) {
      console.log(error, info);
      this.setState({ hasError: true });
    }

    render() {
      const { nextProxy } = this.props;

      return this.state.hasError ? (
        this.renderError()
      ) : (
        <nextProxy.value {...this.props} nextProxy={nextProxy.next()} />
      );
    }

    renderError() {
      return <div>Something went wrong. Check console for errors.</div>;
    }
  }

  ErrorCatchProxy.propTypes = proxyPropTypes;

  return ErrorCatchProxy;
}
