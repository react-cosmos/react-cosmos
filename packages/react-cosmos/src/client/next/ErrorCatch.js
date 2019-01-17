// @flow
/* eslint-env browser */

import { isEqual } from 'lodash';
import React, { Component } from 'react';

type Props = {
  children: React$Node
};

type State = {
  error: null | string
};

export class ErrorCatch extends Component<Props, State> {
  state = {
    error: null
  };

  componentDidCatch(error: Error, info: { componentStack: string }) {
    this.setState({
      error: `${error.message}\n${info.componentStack}`
    });
  }

  componentDidUpdate(prevProps: Props) {
    // A change in children signifies that the problem that caused the current
    // error might've been solved. If the error persists, it will organically
    // trigger the error state again in the next update
    if (this.state.error && !isEqual(this.props.children, prevProps.children)) {
      this.setState({
        error: null
      });
    }
  }

  render() {
    return this.state.error
      ? this.renderError(this.state.error)
      : this.props.children;
  }

  renderError(error: string) {
    // NOTE: In dev mode this output is overlayed by react-error-overlay,
    // which has greater UI and detail. But the information rendered here is
    // most useful in static exports, where react-error-overlay is missing.
    return (
      <>
        <p>
          <strong>Ouch, something wrong!</strong>
        </p>
        <pre>{error}</pre>
        <p>Check console for more info.</p>
      </>
    );
  }
}
