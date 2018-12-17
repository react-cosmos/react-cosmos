// @flow

import React, { Component } from 'react';
import { FixtureCapture } from '../FixtureCapture';
import { FixtureContext } from '../FixtureContext';

import type { Node } from 'react';
import type { Decorators, FixtureContextValue } from '../index.js.flow';

type Props = {
  decorators: Decorators,
  children: Node
} & FixtureContextValue;

// NOTE: Maybe open up Fixture component for naming and other customization. Eg.
//   <Fixture name="An interesting state" namespace="nested/as/follows">
//     <Button>Click me</button>
//   </Fixture>
export class FixtureProvider extends Component<Props, FixtureContextValue> {
  // FYI: gDSFP method is fired on every render, regardless of the cause.
  // https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops
  static getDerivedStateFromProps(props: Props, state: FixtureContextValue) {
    if (props.fixtureState !== state.fixtureState) {
      return {
        fixtureState: props.fixtureState,
        setFixtureState: state.setFixtureState
      };
    }

    return null;
  }

  // Provider value is stored in an object with reference identity to prevent
  // unintentional renders https://reactjs.org/docs/context.html#caveats
  state = {
    fixtureState: this.props.fixtureState,
    setFixtureState: this.props.setFixtureState
  };

  render() {
    const { decorators, children } = this.props;
    const fixtureElement = (
      <FixtureCapture decoratorId="root">{children}</FixtureCapture>
    );

    return (
      <FixtureContext.Provider value={this.state}>
        {wrapElementInDecorators(fixtureElement, decorators)}
      </FixtureContext.Provider>
    );
  }
}

function wrapElementInDecorators(element, decorators) {
  // IDEA: Enfore order based on decorator paths
  return Object.keys(decorators).reduce(
    (prevElement, decoratorPath) =>
      React.createElement(decorators[decoratorPath], {}, prevElement),
    element
  );
}
