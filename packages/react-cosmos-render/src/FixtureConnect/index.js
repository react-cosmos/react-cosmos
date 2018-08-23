// @flow

import type { Node } from 'react';

import React, { Component } from 'react';
import { FixtureProvider } from '../FixtureProvider';
import { updateFixtureState } from '../shared/fixture-state';

import type { FixtureState, SetFixtureState } from '../types/fixture-state';
import type { RendererMessage, RemoteMessage } from '../types/messages';

type Fixtures = {
  [path: string]: Node
};

type Props = {
  rendererId: string,
  fixtures: Fixtures,
  subscribe: (onMessage: (RemoteMessage) => mixed) => mixed,
  unsubscribe: () => mixed,
  postMessage: RendererMessage => mixed
};

type State = {
  fixturePath: ?string,
  fixtureState: FixtureState
};

export class FixtureConnect extends Component<Props, State> {
  state = {
    fixturePath: null,
    fixtureState: {}
  };

  componentDidMount() {
    const { subscribe } = this.props;

    subscribe(this.handleMessage);
    this.postReadyMessage();
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // TODO: Adapt to props.fixtures change (eg. current fixture gets removed)
    const { rendererId, postMessage } = this.props;
    const { fixturePath, fixtureState } = this.state;

    // Fixture state changes are broadcast in componentDidUpdate instead of
    // when they arrive because React batches setState calls, so by waiting for
    // React to apply subsequent state changes we also benefit from batching.
    if (fixturePath && fixtureState !== prevState.fixtureState) {
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
    const { fixturePath, fixtureState } = this.state;

    if (!fixturePath) {
      return 'No fixture loaded';
    }

    if (!fixtures[fixturePath]) {
      throw new Error(`Invalid fixture path ${fixturePath}`);
    }

    return (
      <FixtureProvider
        fixtureState={fixtureState}
        setFixtureState={this.setFixtureState}
      >
        {fixtures[fixturePath]}
      </FixtureProvider>
    );
  }

  handleMessage = (msg: RemoteMessage) => {
    if (msg.type === 'remoteReady') {
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
        fixtureState: {}
      });
    } else if (msg.type === 'setFixtureState') {
      const { fixturePath, fixtureState } = msg.payload;

      // Ensure fixture state applies to currently selected fixture
      if (fixturePath === this.state.fixturePath) {
        this.setFixtureState(fixtureState);
      }
    }
  };

  postReadyMessage() {
    const { rendererId, fixtures, postMessage } = this.props;

    postMessage({
      type: 'rendererReady',
      payload: {
        rendererId,
        fixtures: Object.keys(fixtures)
      }
    });
  }

  setFixtureState: SetFixtureState = (updater, cb) => {
    // Multiple state changes can be dispatched by fixture plugins at almost
    // the same time. Since state changes are batched in React, current state
    // (this.state.fixtureState) can be stale at dispatch time, and extending
    // it can result in cancelling previous state changes that are queued.
    // Using an updater function like ({ prevState }) => nextState ensures
    // every state change is honored, regardless of timing.
    this.setState(
      ({ fixtureState }) => ({
        fixtureState: updateFixtureState(fixtureState, updater)
      }),
      cb
    );
  };
}
