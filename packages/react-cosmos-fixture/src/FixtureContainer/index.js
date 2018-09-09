// @flow

import React, { Component } from 'react';
import { updateState } from 'react-cosmos-shared2/util';
import { FixtureProvider } from '../FixtureProvider';

import type { SetState } from 'react-cosmos-shared2/util';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { FixtureContainerProps } from '../index.js.flow';

type State = {
  fixtureState: ?FixtureState
};

export class FixtureContainer extends Component<FixtureContainerProps, State> {
  state = {
    fixtureState: null
  };

  render() {
    return (
      <FixtureProvider
        fixtureState={this.state.fixtureState}
        setFixtureState={this.setFixtureState}
      >
        {this.props.children}
      </FixtureProvider>
    );
  }

  setFixtureState: SetState<FixtureState> = (updater, cb) => {
    this.setState(
      ({ fixtureState }) => ({
        fixtureState: updateState(fixtureState, updater)
      }),
      cb
    );
  };
}
