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
  // This prop exists for testing purposes. Normally fixture state is contained.
  fixtureState: FixtureState
};

// NOTE: Maybe open up Fixture component for naming and other customization. Eg.
//   <Fixture name="An interesting state" namespace="nested/as/follows">
//     <Button>Click me</button>
//   </Fixture>
export class FixtureProvider extends Component<Props, FixtureContextValue> {
  static defaultProps = {
    fixtureState: EMPTY_FIXTURE_STATE
  };

  // TODO: Remove fixtureState prop once remote protocol is implemented
  UNSAFE_componentWillReceiveProps({ fixtureState }: Props) {
    if (fixtureState !== this.props.fixtureState) {
      this.setState({
        fixtureState
      });
    }
  }

  setFixtureState: SetFixtureState = (updater, cb) => {
    this.setState(({ fixtureState }) => {
      const fixtureChange =
        typeof updater === 'function' ? updater(fixtureState) : updater;

      return {
        fixtureState: {
          ...fixtureState,
          ...fixtureChange
        }
      };
    }, cb);
  };

  // Provider value is stored in an object with reference identity to prevent
  // unintentional renders https://reactjs.org/docs/context.html#caveats
  state = {
    fixtureState: this.props.fixtureState,
    setFixtureState: this.setFixtureState
  };

  render() {
    const { children } = this.props;

    return (
      <FixtureContext.Provider value={this.state}>
        {Array.isArray(children)
          ? children.map((child, index) => this.getWrappedChild(child, index))
          : this.getWrappedChild(children)}
      </FixtureContext.Provider>
    );
  }

  getWrappedChild(node: Node, index?: number) {
    if (!isElement(node)) {
      return node;
    }

    // $FlowFixMe Flow can't get cues from react-is package
    const element: Element<any> = node;

    // Automatically capture the props of the root node if it's an element
    return <CaptureProps key={index}>{element}</CaptureProps>;
  }
}
