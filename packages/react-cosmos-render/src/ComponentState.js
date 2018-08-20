// @flow

import React, { Component, cloneElement } from 'react';
import { FixtureContext } from './FixtureContext';
import { CaptureProps } from './CaptureProps';
import { extractValuesFromObject } from './shared/values';

import type { Element, ElementRef } from 'react';
import type { SetFixtureState } from './types';

type RefCb = (ref: ?ElementRef<any>) => mixed;

type Props = {
  children: Element<any> | (RefCb => Element<any>),
  state?: Object
};

export function ComponentState({ children, state }: Props) {
  return (
    <FixtureContext.Consumer>
      {({ setFixtureState }) => (
        <ComponentStateInner state={state} setFixtureState={setFixtureState}>
          {children}
        </ComponentStateInner>
      )}
    </FixtureContext.Consumer>
  );
}

ComponentState.cosmosCaptureProps = false;

type InnerProps = Props & {
  setFixtureState: SetFixtureState
};

// TODO: Listen and update fixture state on component state changes
class ComponentStateInner extends Component<InnerProps> {
  render() {
    return <CaptureProps>{this.getChildren()}</CaptureProps>;
  }

  getChildren() {
    const { children } = this.props;

    if (typeof children === 'function') {
      return children(this.handleRef);
    }

    return cloneElement(children, { ref: this.handleRef });
  }

  handleRef = (ref: ?ElementRef<any>) => {
    if (ref) {
      const { state, setFixtureState } = this.props;

      if (ref.state) {
        setFixtureState({ state: extractValuesFromObject(ref.state) });
      }

      if (state) {
        // TODO: Read from fixtureData
        ref.setState(state);
      }
    }
  };
}
