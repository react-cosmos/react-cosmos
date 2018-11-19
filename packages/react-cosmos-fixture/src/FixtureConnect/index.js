// @flow

import React, { Component } from 'react';
import { FixtureProvider } from '../FixtureProvider';
import { updateState } from 'react-cosmos-shared2/util';

import type { SetState } from 'react-cosmos-shared2/util';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { RendererRequest } from 'react-cosmos-shared2/renderer';
import type { FixtureConnectProps } from '../index.js.flow';

type State = {
  fixturePath: null | string,
  fixtureState: null | FixtureState,
  renderKey: number
};

type SetFixtureState = SetState<null | FixtureState>;

// TODO: Add props for customizing blank/missing states: `getBlankState` and
// `getMissingState`
export class FixtureConnect extends Component<FixtureConnectProps, State> {
  state = {
    fixturePath: null,
    fixtureState: null,
    // Used to reset FixtureProvider instance on fixturePath change
    renderKey: 0
  };

  componentDidMount() {
    const { subscribe } = this.props;

    subscribe(this.handleRequest);
    this.postReadyMessage();
  }

  componentWillUnmount() {
    this.props.unsubscribe();
  }

  render() {
    const { fixtures } = this.props;
    const { fixturePath, fixtureState, renderKey } = this.state;

    if (!fixturePath) {
      return 'No fixture loaded.';
    }

    // Falsy check doesn't do because fixtures can be any Node, including
    // null or undefined.
    if (!(fixturePath in fixtures)) {
      return `Fixture path not found: ${fixturePath}`;
    }

    return (
      <FixtureProvider
        // Ensure no state leaks between fixture selections, even though under
        // normal circumstances f(fixture, fixtureState) is deterministic.
        key={renderKey}
        fixtureState={fixtureState}
        setFixtureState={this.setFixtureState}
      >
        {fixtures[fixturePath]}
      </FixtureProvider>
    );
  }

  handleRequest = (msg: RendererRequest) => {
    if (msg.type === 'requestFixtureList') {
      return this.postReadyMessage();
    }

    const { rendererId } = msg.payload || {};
    if (rendererId !== this.props.rendererId) {
      return;
    }

    if (msg.type === 'selectFixture') {
      const { fixturePath } = msg.payload;

      this.setState({
        fixturePath,
        // Reset fixture state when selecting new fixture (or when reselecting
        // current fixture)
        fixtureState: null,
        renderKey: this.state.renderKey + 1
      });
    } else if (msg.type === 'setFixtureState') {
      const { fixturePath, fixtureState } = msg.payload;

      // Ensure fixture state applies to currently selected fixture
      if (fixturePath === this.state.fixturePath) {
        this.applyFixtureStateChange(fixtureState);
      }
    }
  };

  postReadyMessage() {
    const { rendererId, fixtures, postMessage } = this.props;

    postMessage({
      type: 'fixtureList',
      payload: {
        rendererId,
        fixtures: Object.keys(fixtures)
      }
    });
  }

  setFixtureState: SetFixtureState = (stateChange, cb) => {
    const { fixturePath } = this.state;

    if (!fixturePath) {
      console.warn(
        '[FixtureConnect] Trying to set fixture state with no fixture selected'
      );
      return;
    }

    this.applyFixtureStateChange(stateChange, () => {
      if (typeof cb === 'function') cb();
      this.postFixtureStateChange(fixturePath);
    });
  };

  applyFixtureStateChange: SetFixtureState = (stateChange, cb) => {
    // Multiple state changes can be dispatched by fixture plugins at almost
    // the same time. Since state changes are batched in React, current state
    // (this.state.fixtureState) can be stale at dispatch time, and extending
    // it can result in cancelling previous state changes that are queued.
    // Using an updater function like ({ prevState }) => nextState ensures
    // every state change is honored, regardless of timing.
    this.setState(
      ({ fixtureState }) => ({
        fixtureState: updateState(fixtureState, stateChange)
      }),
      cb
    );
  };

  postFixtureStateChange = (fixturePath: string) => {
    const { rendererId, postMessage } = this.props;
    const { fixtureState } = this.state;

    postMessage({
      type: 'fixtureStateChange',
      payload: {
        rendererId,
        fixturePath,
        fixtureState
      }
    });
  };
}
