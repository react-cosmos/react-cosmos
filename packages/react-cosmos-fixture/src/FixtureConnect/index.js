// @flow

import React, { Component } from 'react';
import { isEqual } from 'lodash';
import { FixtureProvider } from '../FixtureProvider';
import { updateState } from 'react-cosmos-shared2/util';

import type {
  FixtureState,
  SetFixtureState
} from 'react-cosmos-shared2/fixtureState';
import type { RendererRequest } from 'react-cosmos-shared2/renderer';
import type { FixtureConnectProps } from '../index.js.flow';

type State = {
  fixturePath: null | string,
  fixtureState: null | FixtureState,
  syncedFixtureState: null | FixtureState,
  renderKey: number
};

// TODO: Add props for customizing blank/missing states: `getBlankState` and
// `getMissingState`
export class FixtureConnect extends Component<FixtureConnectProps, State> {
  state = {
    fixturePath: null,
    fixtureState: null,
    // Why is this copy of the fixtureState needed? Two reasons:
    // - To avoid posting fixtureStateChange messages with no changes from
    //   the last message
    // - To piggy back on React's setState batching and only send a
    //   fixtureStateChange message when FixtureConnect updates (via cDU),
    //   instead of posting messages in rapid succession as fixture state
    //   changes are dispatched by fixture plugins
    syncedFixtureState: null,
    // Used to reset FixtureProvider instance on fixturePath change
    renderKey: 0
  };

  componentDidMount() {
    const { subscribe } = this.props;

    subscribe(this.handleRequest);
    this.postFixtureList();
  }

  componentDidUpdate(prevProps: FixtureConnectProps) {
    const { fixtures } = this.props;
    const { fixturePath, fixtureState, syncedFixtureState } = this.state;

    if (!isEqual(fixtures, prevProps.fixtures)) {
      this.postFixtureList();
    }

    if (fixturePath && !isEqual(fixtureState, syncedFixtureState)) {
      this.postFixtureStateChange(fixturePath, fixtureState);
      this.setState({
        syncedFixtureState: fixtureState
      });
    }
  }

  componentWillUnmount() {
    this.props.unsubscribe();
  }

  render() {
    const { fixtures, decorators } = this.props;
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
        decorators={getDecoratorsForFixturePath(decorators, fixturePath)}
        fixtureState={fixtureState}
        setFixtureState={this.setFixtureState}
      >
        {fixtures[fixturePath]}
      </FixtureProvider>
    );
  }

  handleRequest = (msg: RendererRequest) => {
    if (msg.type === 'requestFixtureList') {
      return this.postFixtureList();
    }

    const { rendererId } = msg.payload || {};
    if (rendererId !== this.props.rendererId) {
      return;
    }

    if (msg.type === 'selectFixture') {
      const { fixturePath, fixtureState } = msg.payload;

      this.setState({
        fixturePath,
        fixtureState,
        renderKey: this.state.renderKey + 1
      });
    } else if (msg.type === 'unselectFixture') {
      this.setState({
        fixturePath: null,
        fixtureState: null,
        renderKey: 0
      });
    } else if (msg.type === 'setFixtureState') {
      const { fixturePath, fixtureState } = msg.payload;

      // Ensure fixture state applies to currently selected fixture
      if (fixturePath === this.state.fixturePath) {
        this.setState({
          fixtureState,
          syncedFixtureState: fixtureState
        });
      }
    }
  };

  postFixtureList() {
    const { rendererId, fixtures, postMessage } = this.props;

    postMessage({
      type: 'fixtureList',
      payload: {
        rendererId,
        fixtures: Object.keys(fixtures)
      }
    });
  }

  setFixtureState: SetFixtureState = (fixtureStateChange, cb) => {
    const { fixturePath } = this.state;

    if (!fixturePath) {
      console.warn(
        '[FixtureConnect] Trying to set fixture state with no fixture selected'
      );
      return;
    }

    // Multiple state changes can be dispatched by fixture plugins at almost
    // the same time. Since state changes are batched in React, current state
    // (this.state.fixtureState) can be stale at dispatch time, and extending
    // it can result in cancelling previous state changes that are queued.
    // Using an updater function like ({ prevState }) => nextState ensures
    // every state change is honored, regardless of timing.
    this.setState(
      ({ fixtureState }) => ({
        fixtureState: updateState(fixtureState, fixtureStateChange)
      }),
      cb
    );
  };

  postFixtureStateChange = (
    fixturePath: string,
    fixtureState: null | FixtureState
  ) => {
    const { rendererId, postMessage } = this.props;

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

function getDecoratorsForFixturePath(decorators, fixturePath) {
  return Object.keys(decorators)
    .filter(decPath => fixturePath.indexOf(`${getParentPath(decPath)}/`) === 0)
    .reduce((acc, decPath) => ({ ...acc, [decPath]: decorators[decPath] }), {});
}

function getParentPath(nestedPath) {
  // Remove everything right of the right-most forward slash
  return nestedPath.replace(/^(.+)\/.+$/, '$1');
}
