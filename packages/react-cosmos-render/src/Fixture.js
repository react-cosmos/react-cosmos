// @flow

import { isElement } from 'react-is';
import React, { Component } from 'react';
import { CaptureProps } from './CaptureProps';
import { FixtureContext, EMPTY_FIXTURE_STATE } from './FixtureContext';

import type { Node, Element } from 'react';
import type { FixtureState, FixtureContextValue } from './types';

type Props = {
  children: Node,
  fixtureState: FixtureState,
  onUpdate?: (fixtureState: FixtureState) => mixed
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

  setFixtureState = (fixtureStateParts: $Shape<FixtureState>) => {
    const { fixtureState, onUpdate } = this.props;

    if (typeof onUpdate === 'function') {
      onUpdate({
        ...fixtureState,
        ...fixtureStateParts
      });
    }
  };

  // Provider value is stored in an object with reference identity to prevent
  // unintentional renders https://reactjs.org/docs/context.html#caveats
  state = {
    fixtureState: this.props.fixtureState,
    setFixtureState: this.setFixtureState
  };

  render() {
    const { children } = this.props;

    if (!isElement(children)) {
      return children;
    }

    // $FlowFixMe Flow can't get cues from react-is package
    const element: Element<any> = children;

    return (
      <FixtureContext.Provider value={this.state}>
        <CaptureProps>{element}</CaptureProps>
      </FixtureContext.Provider>
    );
  }
}
