// @flow

import React, { Component } from 'react';
import { isEqual } from 'lodash';
import { updateState } from 'react-cosmos-shared2/util';
import { FixtureProvider } from '../FixtureProvider';

import type {
  FixtureState,
  SetFixtureState
} from 'react-cosmos-shared2/fixtureState';
import type {
  RendererRequest,
  SelectFixtureRequest,
  SetFixtureStateRequest
} from 'react-cosmos-shared2/renderer';
import type {
  DecoratorType,
  DecoratorsByPath,
  FixtureConnectProps
} from '../index.js.flow';

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
    this.postReadyState();
  }

  componentDidUpdate(prevProps: FixtureConnectProps) {
    const { fixtures } = this.props;
    const { fixturePath, fixtureState, syncedFixtureState } = this.state;

    if (!isEqual(fixtures, prevProps.fixtures)) {
      this.postFixtureListUpdate();
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

  shouldComponentUpdate(prevProps: FixtureConnectProps, prevState: State) {
    // This check exists mainly to prevent updating the fixture tree when
    // fixture state setters resulted in no fixture state change
    return !isEqual(this.props, prevProps) || !isEqual(this.state, prevState);
  }

  render() {
    const { fixtures, systemDecorators, userDecorators } = this.props;
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
        // renderKey controls whether to reuse previous instances (and
        // transition props) or rebuild render tree from scratch
        key={renderKey}
        decorators={getSortedDecoratorsForFixturePath(
          systemDecorators,
          userDecorators,
          fixturePath
        )}
        fixtureState={fixtureState}
        setFixtureState={this.setFixtureState}
      >
        {fixtures[fixturePath]}
      </FixtureProvider>
    );
  }

  handleRequest = (msg: RendererRequest) => {
    if (msg.type === 'pingRenderers') {
      return this.postReadyState();
    }

    const { rendererId } = msg.payload || {};
    if (rendererId !== this.props.rendererId) {
      return;
    }

    if (doesRequestChangeFixture(msg)) {
      this.fireChangeCallback();
    }

    switch (msg.type) {
      case 'selectFixture':
        return this.handleSelectFixtureRequest(msg);
      case 'unselectFixture':
        return this.handleUnselectFixtureRequest();
      case 'setFixtureState':
        return this.handleSelectFixtureStateRequest(msg);
      default:
      // This Is Fine™
      // Actually, we can't be angry about getting unrelated messages here
      // because we don't do any preliminary message filtering to ignore stuff
      // like browser devtools communication, nor do we have any message
      // metadata conventions in place to perform such filtering at the moment
    }
  };

  handleSelectFixtureRequest({ payload }: SelectFixtureRequest) {
    const { fixturePath, fixtureState } = payload;

    this.setState({
      fixturePath,
      fixtureState,
      renderKey: this.state.renderKey + 1
    });
  }

  handleUnselectFixtureRequest() {
    this.setState({
      fixturePath: null,
      fixtureState: null,
      renderKey: 0
    });
  }

  handleSelectFixtureStateRequest({ payload }: SetFixtureStateRequest) {
    const { fixturePath, fixtureState } = payload;

    // Ensure fixture state applies to currently selected fixture
    if (fixturePath === this.state.fixturePath) {
      this.setState({
        fixtureState,
        syncedFixtureState: fixtureState
      });
    }
  }

  postReadyState() {
    const { rendererId, postMessage } = this.props;

    postMessage({
      type: 'rendererReady',
      payload: {
        rendererId,
        fixtures: this.getFixtureNames()
      }
    });
  }

  postFixtureListUpdate() {
    const { rendererId, postMessage } = this.props;

    postMessage({
      type: 'fixtureListUpdate',
      payload: {
        rendererId,
        fixtures: this.getFixtureNames()
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

  getFixtureNames(): string[] {
    return Object.keys(this.props.fixtures);
  }

  fireChangeCallback() {
    const { onFixtureChange } = this.props;

    if (typeof onFixtureChange === 'function') {
      onFixtureChange();
    }
  }
}

function getSortedDecoratorsForFixturePath(
  systemDecorators: DecoratorType[],
  decorators: DecoratorsByPath,
  fixturePath: string
) {
  return [
    ...systemDecorators,
    ...getSortedDecorators(getDecoratorsForFixturePath(decorators, fixturePath))
  ];
}

function getSortedDecorators(decoratorsByPath): DecoratorType[] {
  return sortPathsByDepthAsc(Object.keys(decoratorsByPath)).map(
    decoratorPath => decoratorsByPath[decoratorPath]
  );
}

function sortPathsByDepthAsc(paths) {
  return [...paths].sort(
    (a, b) =>
      getPathNestingLevel(a) - getPathNestingLevel(b) || a.localeCompare(b)
  );
}

function getPathNestingLevel(path) {
  return path.split('/').length;
}

function getDecoratorsForFixturePath(decorators, fixturePath) {
  return Object.keys(decorators)
    .filter(decPath => fixturePath.indexOf(`${getParentPath(decPath)}/`) === 0)
    .reduce((acc, decPath) => ({ ...acc, [decPath]: decorators[decPath] }), {});
}

function getParentPath(nestedPath) {
  // Remove everything right of the right-most forward slash, or return an
  // empty string if path has no forward slash
  return nestedPath.replace(/^((.+)\/)?.+$/, '$2');
}

function doesRequestChangeFixture(r: RendererRequest) {
  return r.type === 'selectFixture' || r.type === 'unselectFixture';
}
