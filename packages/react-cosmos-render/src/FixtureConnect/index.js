// @flow

import type { Node } from 'react';

import React, { Component } from 'react';
import { FixtureProvider } from '../FixtureProvider';
import { uuid } from '../shared/uuid';

import type { FixtureState, SetFixtureState } from '../types/fixture-state';
import type {
  RendererId,
  RendererMessage,
  RemoteMessage
} from '../types/messages';

type Fixtures = {
  [path: string]: Node
};

type Props = {
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
  rendererId = uuid();

  state = {
    fixturePath: null,
    fixtureState: {}
  };

  componentDidMount() {
    const { subscribe } = this.props;

    subscribe(this.handleMessage);
    this.postReadyMessage();
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
      this.postReadyMessage();
    } else if (msg.type === 'selectFixture') {
      this.selectFixture(msg.payload);
    }
  };

  postReadyMessage() {
    const { fixtures, postMessage } = this.props;

    postMessage({
      type: 'rendererReady',
      payload: {
        rendererId: this.rendererId,
        fixtures: Object.keys(fixtures)
      }
    });
  }

  selectFixture({
    rendererId,
    fixturePath
  }: {
    rendererId: RendererId,
    fixturePath: ?string
  }) {
    if (rendererId !== this.rendererId) {
      return;
    }

    this.setState({
      fixturePath,
      // Reset fixture state when selecting new fixture (or when reselecting
      // current fixture)
      fixtureState: {}
    });
  }

  setFixtureState: SetFixtureState = updater => {
    // TODO: Update state
    // TODO: Post setFixtureState message
    console.log('setFixtureState', { updater });
  };
}
