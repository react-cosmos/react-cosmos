// @flow

import { isElement } from 'react-is';
import React, { Component } from 'react';
import { CaptureProps } from './CaptureProps';
import { FixtureContext, EMPTY_FIXTURE_STATE } from './FixtureContext';

import type { Node, Element } from 'react';
import type {
  FixtureState,
  SetFixtureState,
  FixtureContextValue
} from './types';

type Props = {
  children: Node,
  fixtureState: FixtureState,
  onFixtureStateChange?: (
    fixtureState: FixtureState | (FixtureState => $Shape<FixtureState>)
  ) => mixed
};

// NOTE: Maybe rename to FixtureProvider, and open up Fixture component for
// naming and other customization. Eg.
// <Fixture name="An interesting state" namespace="nested/as/follows">
//   <Button>Click me</button>
// </Fixture>
export class Fixture extends Component<Props, FixtureContextValue> {
  static defaultProps = {
    fixtureState: EMPTY_FIXTURE_STATE
  };

  static getDerivedStateFromProps(props: Props, state: FixtureContextValue) {
    if (props.fixtureState !== state.fixtureState) {
      return {
        fixtureState: props.fixtureState,
        setFixtureState: state.setFixtureState
      };
    }

    return null;
  }

  setFixtureState: SetFixtureState = updater => {
    const { onFixtureStateChange } = this.props;

    if (typeof onFixtureStateChange === 'function') {
      onFixtureStateChange(updater);
    }
  };

  // Provider value is stored in an object with reference identity to prevent
  // unintentional renders https://reactjs.org/docs/context.html#caveats
  state = {
    fixtureState: this.props.fixtureState,
    setFixtureState: this.setFixtureState
  };

  render() {
    return (
      <FixtureContext.Provider value={this.state}>
        {this.getChildren()}
      </FixtureContext.Provider>
    );
  }

  getChildren() {
    const { children } = this.props;

    // TODO: Also capture props on array of children
    if (!isElement(children)) {
      return children;
    }

    // $FlowFixMe Flow can't get cues from react-is package
    const element: Element<any> = children;

    // Automatically capture the props of the root node if it's an element
    return <CaptureProps>{element}</CaptureProps>;
  }
}
