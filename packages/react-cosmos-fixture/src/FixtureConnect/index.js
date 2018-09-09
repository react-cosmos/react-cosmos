// @flow

import React, { Component } from 'react';
import { FixtureProvider } from '../FixtureProvider';
import { updateState } from 'react-cosmos-shared2/util';

import type { SetState } from 'react-cosmos-shared2/util';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { RendererRequest } from 'react-cosmos-shared2/renderer';
import type { FixtureConnectProps } from '../index.js.flow';

type State = {
  fixturePath: ?string,
  fixtureState: ?FixtureState,
  renderKey: number
};

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

  componentDidUpdate(prevProps: FixtureConnectProps, prevState: State) {
    // TODO: Adapt to props.fixtures change (eg. current fixture gets removed)
    const { rendererId, postMessage } = this.props;
    const { fixturePath, fixtureState } = this.state;

    // Fixture state changes are broadcast in componentDidUpdate instead of
    // when they arrive because React batches setState calls, so by waiting for
    // React to apply subsequent state changes we also benefit from batching.
    if (
      fixturePath &&
      fixtureState &&
      fixtureState !== prevState.fixtureState
    ) {
      postMessage({
        type: 'fixtureState',
        payload: {
          rendererId,
          fixturePath,
          fixtureState
        }
      });
    }
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

    if (!fixtures[fixturePath]) {
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

    const { rendererId } = msg.payload;
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
      const { fixturePath, fixtureStateChange } = msg.payload;

      // Ensure fixture state applies to currently selected fixture
      if (fixturePath === this.state.fixturePath) {
        this.setFixtureState(fixtureStateChange);
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

  setFixtureState: SetState<FixtureState> = (updater, cb) => {
    // Multiple state changes can be dispatched by fixture plugins at almost
    // the same time. Since state changes are batched in React, current state
    // (this.state.fixtureState) can be stale at dispatch time, and extending
    // it can result in cancelling previous state changes that are queued.
    // Using an updater function like ({ prevState }) => nextState ensures
    // every state change is honored, regardless of timing.
    this.setState(
      ({ fixtureState }) => ({
        fixtureState: updateState(fixtureState, updater)
      }),
      cb
    );
  };
}
