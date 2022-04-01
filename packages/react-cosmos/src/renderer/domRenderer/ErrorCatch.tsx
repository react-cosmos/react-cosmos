import { isEqual } from 'lodash';
import React from 'react';
import { ReactDecoratorProps } from '../../core/react/types.js';
import { areNodesEqual } from '../../utils/react/areNodesEqual.js';

type State = {
  error: null | string;
};

export class ErrorCatch extends React.Component<ReactDecoratorProps, State> {
  state: State = {
    error: null,
  };

  componentDidCatch(error: Error, info: { componentStack: string }) {
    this.setState({
      error: `${error.message}\n${info.componentStack}`,
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
    // Don't render error details here in dev mode because react-error-overlay
    // takes care of it in a nicer way. We used to render both for a while but
    // it proved annoying. react-error-overlay has a slight delay and seeing
    // the same error reported twice feels clumsy.
    if (__DEV__) {
      return null;
    }

    // In static exports, however, where react-error-overlay is missing,
    // rendering plain error details is superior to showing a blank screen.
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
  return !areNodesEqual(f1, f2, true);
}

function fixtureStateChanged(fS1: React.ReactNode, fS2: React.ReactNode) {
  return !isEqual(fS1, fS2);
}
