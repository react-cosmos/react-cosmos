// @flow

import React, { Component } from 'react';
import { Fixture } from './Fixture';

import type { Node } from 'react';
import type { FixtureState } from './types';

type Props = {
  children: Node,
  // This prop exists for testing purposes. Normally fixture state is contained.
  fixtureState?: FixtureState
};

export class FixtureConnect extends Component<Props, FixtureState> {
  state = {};

  static getDerivedStateFromProps(props: Props, state: FixtureState) {
    if (props.fixtureState && props.fixtureState !== state) {
      return props.fixtureState;
    }

    return null;
  }

  render() {
    return (
      <Fixture
        fixtureState={this.state}
        onFixtureStateChange={updater => {
          this.setState(fixtureState => {
            const fixtureChange =
              typeof updater === 'function' ? updater(fixtureState) : updater;
            return {
              ...fixtureState,
              ...fixtureChange
            };
          });
        }}
      >
        {this.props.children}
      </Fixture>
    );
  }
}
