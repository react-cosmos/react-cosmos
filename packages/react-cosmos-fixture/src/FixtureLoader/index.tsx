import * as React from 'react';
import { isEqual } from 'lodash';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import {
  FixtureNamesByPath,
  FixtureId,
  RendererRequest,
  SelectFixtureRequest,
  SetFixtureStateRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import {
  DecoratorType,
  DecoratorsByPath,
  FixturesByPath,
  RendererConnectApi,
  RendererConnect,
  SetFixtureState
} from '../shared';
import { FixtureProvider } from '../FixtureProvider';
import { getFixtureNames, getFixtureNode } from './fixtureHelpers';

export type Props = {
  rendererId: string;
  rendererConnect: RendererConnect;
  fixtures: FixturesByPath;
  systemDecorators: DecoratorType[];
  userDecorators: DecoratorsByPath;
  onFixtureChange?: () => unknown;
};

type State = {
  selectedFixture: null | {
    fixtureId: FixtureId;
    fixtureState: FixtureState;
    // Why is this copy of the fixtureState needed? Two reasons:
    // - To avoid posting fixtureStateChange messages with no changes from
    //   the last message
    // - To piggy back on React's setState batching and only send a
    //   fixtureStateChange message when FixtureLoader updates (via cDU),
    //   instead of posting messages in rapid succession as fixture state
    //   changes are dispatched by fixture plugins
    syncedFixtureState: FixtureState;
  };
  // Used to reset FixtureProvider instance on fixturePath change
  renderKey: number;
};

// TODO: Add props for customizing blank/missing states: `getBlankState` and
// `getMissingState`
export class FixtureLoader extends React.Component<Props, State> {
  state: State = {
    selectedFixture: null,
    renderKey: 0
  };

  rendererConnectApi: null | RendererConnectApi = null;

  componentDidMount() {
    const { rendererConnect } = this.props;
    this.rendererConnectApi = rendererConnect(this.handleRequest);
    this.postReadyState();
  }

  componentWillUnmount() {
    if (this.rendererConnectApi) {
      this.rendererConnectApi.off();
    }
  }

  componentDidUpdate(prevProps: Props) {
    const { fixtures } = this.props;
    if (!isEqual(fixtures, prevProps.fixtures)) {
      this.postFixtureListUpdate();
    }

    const { selectedFixture } = this.state;
    if (selectedFixture) {
      const { fixtureId, fixtureState, syncedFixtureState } = selectedFixture;
      if (fixtureId && !isEqual(fixtureState, syncedFixtureState)) {
        this.postFixtureStateChange(fixtureId, fixtureState);
        this.updateSyncedFixtureState(syncedFixtureState);
      }
    }
  }

  shouldComponentUpdate(prevProps: Props, prevState: State) {
    // This check exists mainly to prevent updating the fixture tree when
    // fixture state setters resulted in no fixture state change
    return !isEqual(this.props, prevProps) || !isEqual(this.state, prevState);
  }

  render() {
    const { selectedFixture } = this.state;
    if (!selectedFixture) {
      return 'No fixture loaded.';
    }

    const { fixtures } = this.props;
    const { fixtureId, fixtureState } = selectedFixture;
    // Falsy check doesn't do because fixtures can be any Node, including
    // null or undefined.
    if (!fixtures.hasOwnProperty(fixtureId.path)) {
      return `Fixture path not found: ${fixtureId.path}`;
    }

    const fixtureExport = fixtures[fixtureId.path];
    const fixture = getFixtureNode(fixtureExport, fixtureId.name);
    if (typeof fixture === 'undefined') {
      return `Invalid fixture ID: ${JSON.stringify(fixtureId)}`;
    }

    const { systemDecorators, userDecorators } = this.props;
    const { renderKey } = this.state;
    return (
      <FixtureProvider
        // renderKey controls whether to reuse previous instances (and
        // transition props) or rebuild render tree from scratch
        key={renderKey}
        decorators={getSortedDecoratorsForFixturePath(
          systemDecorators,
          userDecorators,
          fixtureId.path
        )}
        fixtureState={fixtureState}
        setFixtureState={this.setFixtureState}
      >
        {fixture}
      </FixtureProvider>
    );
  }

  handleRequest = (msg: RendererRequest) => {
    if (msg.type === 'pingRenderers') {
      return this.postReadyState();
    }

    if (!msg.payload || msg.payload.rendererId !== this.props.rendererId) {
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
        return this.handleSetFixtureStateRequest(msg);
      default:
      // This Is Fine™
      // Actually, we can't be angry about getting unrelated messages here
      // because we don't do any preliminary message filtering to ignore stuff
      // like browser devtools communication, nor do we have any message
      // metadata conventions in place to perform such filtering at the moment
    }
  };

  handleSelectFixtureRequest({ payload }: SelectFixtureRequest) {
    const { fixtureId, fixtureState } = payload;
    this.setState({
      selectedFixture: {
        fixtureId,
        fixtureState,
        syncedFixtureState: fixtureState
      },
      renderKey: this.state.renderKey + 1
    });
  }

  handleUnselectFixtureRequest() {
    this.setState({
      selectedFixture: null,
      renderKey: 0
    });
  }

  handleSetFixtureStateRequest({ payload }: SetFixtureStateRequest) {
    const { fixtureId, fixtureState } = payload;
    const { selectedFixture } = this.state;
    // Ensure fixture state applies to currently selected fixture
    if (selectedFixture && isEqual(fixtureId, selectedFixture.fixtureId)) {
      this.setState({
        selectedFixture: {
          fixtureId,
          fixtureState,
          syncedFixtureState: fixtureState
        }
      });
    }
  }

  postReadyState() {
    const { rendererId } = this.props;
    this.postMessage({
      type: 'rendererReady',
      payload: {
        rendererId,
        fixtures: this.getFixtureNames()
      }
    });
  }

  postFixtureListUpdate() {
    const { rendererId } = this.props;
    this.postMessage({
      type: 'fixtureListUpdate',
      payload: {
        rendererId,
        fixtures: this.getFixtureNames()
      }
    });
  }

  postFixtureStateChange = (
    fixtureId: FixtureId,
    fixtureState: FixtureState
  ) => {
    const { rendererId } = this.props;
    this.postMessage({
      type: 'fixtureStateChange',
      payload: {
        rendererId,
        fixtureId,
        fixtureState
      }
    });
  };

  setFixtureState: SetFixtureState = stateUpdate => {
    if (!this.state.selectedFixture) {
      console.warn(
        '[FixtureLoader] Trying to set fixture state with no fixture selected'
      );
      return;
    }

    // Multiple state changes can be dispatched by fixture plugins at almost
    // the same time. Since state changes are batched in React, current state
    // (this.state.fixtureState) can be stale at dispatch time, and extending
    // it can result in cancelling previous state changes that are queued.
    // Using an updater function like ({ prevState }) => nextState ensures
    // every state change is honored, regardless of timing.
    this.setState(({ selectedFixture }: State) => {
      if (!selectedFixture) {
        return null;
      }

      return {
        selectedFixture: {
          ...selectedFixture,
          fixtureState: stateUpdate(selectedFixture.fixtureState)
        }
      };
    });
  };

  getFixtureNames(): FixtureNamesByPath {
    return getFixtureNames(this.props.fixtures);
  }

  fireChangeCallback() {
    const { onFixtureChange } = this.props;
    if (typeof onFixtureChange === 'function') {
      onFixtureChange();
    }
  }

  updateSyncedFixtureState(syncedFixtureState: FixtureState) {
    this.setState(({ selectedFixture }) => {
      if (!selectedFixture) {
        return null;
      }

      // Other updates that alter state.selectedFixture can be pending when this
      // update is submitted. Those updates will be applied first. With this in
      // mind, we use a state setter callback to only override syncedFixtureState
      // and keep the latest values of other state parts.
      return {
        selectedFixture: {
          ...selectedFixture,
          syncedFixtureState
        }
      };
    });
  }

  postMessage(msg: RendererResponse) {
    if (this.rendererConnectApi) {
      this.rendererConnectApi.postMessage(msg);
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

function getSortedDecorators(decorators: DecoratorsByPath): DecoratorType[] {
  return sortPathsByDepthAsc(Object.keys(decorators)).map(
    decoratorPath => decorators[decoratorPath]
  );
}

function sortPathsByDepthAsc(paths: string[]) {
  return [...paths].sort(
    (a, b) =>
      getPathNestingLevel(a) - getPathNestingLevel(b) || a.localeCompare(b)
  );
}

function getPathNestingLevel(path: string) {
  return path.split('/').length;
}

function getDecoratorsForFixturePath(
  decorators: DecoratorsByPath,
  fixturePath: string
) {
  return Object.keys(decorators)
    .filter(decPath => fixturePath.indexOf(`${getParentPath(decPath)}/`) === 0)
    .reduce((acc, decPath) => ({ ...acc, [decPath]: decorators[decPath] }), {});
}

function getParentPath(nestedPath: string) {
  // Remove everything right of the right-most forward slash, or return an
  // empty string if path has no forward slash
  return nestedPath.replace(/^((.+)\/)?.+$/, '$2');
}

function doesRequestChangeFixture(r: RendererRequest) {
  return r.type === 'selectFixture' || r.type === 'unselectFixture';
}
