// @flow
/* eslint-env browser */

import React, { Component } from 'react';

declare var __DEV__: boolean;

type Props = {
  children: React$Node
};

type State = {
  errored: boolean,
  errorMessage: string
};

export class ErrorCatch extends Component<Props, State> {
  state = {
    errored: false,
    errorMessage: ''
  };

  componentDidCatch(error: Error, info: { componentStack: string }) {
    this.setState({
      errored: true,
      errorMessage: `${error.message}\n${info.componentStack}`
    });
    reportRuntimeErrorsToParentWindow();
  }

  render() {
    return this.state.errored ? this.renderError() : this.props.children;
  }

  renderError() {
    // NOTE: In dev mode this output is overlayed by react-error-overlay,
    // which has greater UI and detail. But the information rendered here is
    // most useful in static exports, where react-error-overlay is missing.
    return (
      <>
        <p>
          <strong>Ouch, something wrong!</strong>
        </p>
        <pre>{this.state.errorMessage}</pre>
        <p>Check console for more info.</p>
      </>
    );
  }
}

function reportRuntimeErrorsToParentWindow() {
  // NOTE: react-error-overlay calls onRendererRuntimeError in dev mode, for
  // both errors caught by this boundary as well as global unhandled exceptions.
  // But react-error-overlay is not included in static exports, so we
  // compensate by calling onRendererRuntimeError here instead. This also means
  // that global unhandled exceptions must be treated separately in static
  // exports.
  if (!__DEV__) {
    if (typeof parent.onRendererRuntimeError === 'function') {
      parent.onRendererRuntimeError();
    }
  }
}
