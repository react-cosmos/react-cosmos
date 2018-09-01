// @flow

import { isElement } from 'react-is';
import React, { Component, Fragment } from 'react';
import { CaptureProps } from '../CaptureProps';
import { FixtureContext } from '../FixtureContext';

import type { Node, Element } from 'react';
import type {
  FixtureProviderProps,
  FixtureContextValue
} from '../index.js.flow';

// NOTE: Maybe open up Fixture component for naming and other customization. Eg.
//   <Fixture name="An interesting state" namespace="nested/as/follows">
//     <Button>Click me</button>
//   </Fixture>
export class FixtureProvider extends Component<
  FixtureProviderProps,
  FixtureContextValue
> {
  // FYI: gDSFP method is fired on every render, regardless of the cause.
  // https://reactjs.org/docs/react-component.html#static-getderivedstatefromprops
  static getDerivedStateFromProps(
    props: FixtureProviderProps,
    state: FixtureContextValue
  ) {
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

    // It wouldn't make sense to capture a Fragment's props, but it wouldn't
    // work either. The fragment type is Symbol, which is considered a primitive
    // type and isn't accepted as a WeakMap key
    if (element.type === Fragment) {
      return element.props.children.map((child, index) =>
        this.getWrappedChild(child, index)
      );
    }

    // Fixture decorators can opt out from their props being captured. Eg.
    // Adding ComponentState's props to fixture state would be unwanted noise.
    if (element.type.cosmosCaptureProps === false) {
      return element;
    }

    // Automatically capture the props of the root node if it's an element
    return <CaptureProps key={index}>{element}</CaptureProps>;
  }
}
