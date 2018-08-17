// @flow

import React, { Component } from 'react';
import { FixtureContext } from './FixtureContext';
import { CaptureProps } from './CaptureProps';
import { extractPropsFromObject } from './shared';

import type { Element, ElementRef } from 'react';
import type { UpdateFixtureData } from './types';

type RefCb = (ref: ?ElementRef<any>) => mixed;

type Props = {
  children: Element<any> | (RefCb => Element<any>),
  state?: Object
};

export function ComponentState({ children, state }: Props) {
  return (
    <FixtureContext.Consumer>
      {({ updateFixtureData }) => (
        <ComponentStateInner
          state={state}
          updateFixtureData={updateFixtureData}
        >
          {children}
        </ComponentStateInner>
      )}
    </FixtureContext.Consumer>
  );
}

ComponentState.cosmosCaptureProps = false;

type InnerProps = Props & {
  updateFixtureData: UpdateFixtureData
};

// TODO: Listen and update fixture data on state changes
class ComponentStateInner extends Component<InnerProps> {
  render() {
    return <CaptureProps>{this.getChildren()}</CaptureProps>;
  }

  getChildren() {
    const { children } = this.props;

    if (typeof children === 'function') {
      return children(this.handleRef);
    }

    // Hack alert: Editing React Element by hand
    return <children.type {...children.props} ref={this.handleRef} />;
  }

  handleRef = (ref: ?ElementRef<any>) => {
    if (ref) {
      const { state, updateFixtureData } = this.props;

      if (ref.state) {
        updateFixtureData('state', extractPropsFromObject(ref.state));
      }

      if (state) {
        ref.setState(state);
      }
    }
  };
}
