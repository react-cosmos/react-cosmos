import React from 'react';
import { isEqual } from 'lodash';
import { ReactDecoratorProps, areNodesEqual } from 'react-cosmos-shared2/react';

type State = {
  error: null | string;
};

export class ErrorCatch extends React.Component<ReactDecoratorProps, State> {
  state: State = {
    error: null
  };

  componentDidCatch(error: Error, info: { componentStack: string }) {
    this.setState({
      error: `${error.message}\n${info.componentStack}`
    });
  }

  componentDidUpdate(prevProps: ReactDecoratorProps) {
    // A change in fixture (children) or fixture state signifies that the
    // problem that caused the current error might've been solved. If the error
    // persists, it will organically trigger the error state again in the next
    // update
    if (
      this.state.error &&
      (fixtureChanged(this.props.children, prevProps.children) ||
        fixtureStateChanged(this.props.fixtureState, prevProps.fixtureState))
    ) {
      this.setState({ error: null });
      this.props.onErrorReset();
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

function fixtureChanged(f1: React.ReactNode, f2: React.ReactNode) {
  return !areNodesEqual(f1, f2);
}

function fixtureStateChanged(fS1: React.ReactNode, fS2: React.ReactNode) {
  return !isEqual(fS1, fS2);
}
