// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { removeItem, updateState } from 'react-cosmos-shared2/util';
import { defaultUiState, PlaygroundContext } from '../PlaygroundContext';
import { getUrlParams, pushUrlParams, onUrlChange } from './router';

import type { Node } from 'react';
import type { SetState } from 'react-cosmos-shared2/util';
import type {
  RendererRequest,
  RendererResponse,
  FixtureListMsg,
  FixtureStateMsg
} from 'react-cosmos-shared2/renderer';
import type {
  PlaygroundOptions,
  UrlParams,
  UiState,
  ReplaceFixtureState,
  RendererRequestListener,
  RendererResponseListener,
  PlaygroundContextValue
} from '../index.js.flow';

type Props = {
  children: Node,
  options: PlaygroundOptions
};

export class PlaygroundProvider extends Component<
  Props,
  PlaygroundContextValue
> {
  setUrlParams: SetState<UrlParams> = (paramChange, cb) => {
    this.setState(
      ({ urlParams }) => ({ urlParams: updateState(urlParams, paramChange) }),
      () => {
        pushUrlParams(this.state.urlParams);
        callPotentialFunction(cb);
      }
    );
  };

  setUiState: SetState<UiState> = (stateChange, cb) => {
    this.setState(
      ({ uiState }) => ({ uiState: updateState(uiState, stateChange) }),
      cb
    );
  };

  replaceFixtureState: ReplaceFixtureState = (fixtureState, cb) => {
    this.setState({ fixtureState }, cb);
  };

  requestListeners: RendererRequestListener[] = [];

  postRendererRequest = (msg: RendererRequest) => {
    this.requestListeners.forEach(listener => listener(msg));
  };

  onRendererRequest = (listener: RendererRequestListener) => {
    this.requestListeners.push(listener);

    return () => {
      this.requestListeners = removeItem(this.requestListeners, listener);
    };
  };

  responseListeners: RendererResponseListener[] = [];

  receiveRendererResponse = (msg: RendererResponse) => {
    this.responseListeners.forEach(listener => listener(msg));
  };

  onRendererResponse = (listener: RendererResponseListener) => {
    this.responseListeners.push(listener);

    return () => {
      this.responseListeners = removeItem(this.responseListeners, listener);
    };
  };

  state = {
    options: this.props.options,
    urlParams: getUrlParams(),
    setUrlParams: this.setUrlParams,
    uiState: defaultUiState,
    setUiState: this.setUiState,
    fixtureState: null,
    replaceFixtureState: this.replaceFixtureState,
    postRendererRequest: this.postRendererRequest,
    onRendererRequest: this.onRendererRequest,
    receiveRendererResponse: this.receiveRendererResponse,
    onRendererResponse: this.onRendererResponse
  };

  render() {
    const { children } = this.props;

    return (
      <PlaygroundContext.Provider value={this.state}>
        <Container>{children}</Container>
      </PlaygroundContext.Provider>
    );
  }

  unsubscribeFromRendererResponses: ?() => mixed;
  unsubscribeFromUrlChanges: ?() => mixed;

  componentDidMount() {
    this.unsubscribeFromRendererResponses = this.onRendererResponse(
      this.handleRendererResponse
    );
    this.unsubscribeFromUrlChanges = onUrlChange(urlParams => {
      this.setState({ urlParams });
    });
  }

  componentDidUpdate(prevProps: Props, prevState: PlaygroundContextValue) {
    const { fixture } = this.state.urlParams;

    if (fixture !== prevState.urlParams.fixture) {
      this.selectFixture(fixture || null);
    }
  }

  componentWillUnmount() {
    callPotentialFunction(this.unsubscribeFromRendererResponses);
    callPotentialFunction(this.unsubscribeFromUrlChanges);
  }

  handleRendererResponse = (msg: RendererResponse) => {
    switch (msg.type) {
      case 'fixtureList':
        return this.handleFixtureListResponse(msg);
      case 'fixtureState':
        return this.handleFixtureStateResponse(msg);
      default:
      // No need to handle every message. Maybe some plugin cares about it.
    }
  };

  handleFixtureListResponse({ payload }: FixtureListMsg) {
    const {
      uiState: { renderers }
    } = this.state;
    const { rendererId, fixtures } = payload;

    const stateChange = {
      renderers:
        renderers.indexOf(rendererId) === -1
          ? [...renderers, rendererId]
          : renderers,
      fixtures
    };

    this.setUiState(stateChange, () => {
      // We use the `fixtureList` message as a queue that the renderer is
      // ready and tell it to load the selected fixture
      const { fixture } = this.state.urlParams;

      if (fixture) {
        this.selectFixture(fixture);
      }
    });
  }

  handleFixtureStateResponse({ payload }: FixtureStateMsg) {
    this.replaceFixtureState(payload.fixtureState);
  }

  selectFixture(fixturePath: null | string) {
    const {
      uiState: { renderers }
    } = this.state;

    renderers.forEach(rendererId => {
      this.postRendererRequest({
        type: 'selectFixture',
        payload: {
          rendererId,
          fixturePath
        }
      });
    });
  }
}

function callPotentialFunction(fn: ?Function) {
  if (typeof fn === 'function') {
    fn();
  }
}

const Container = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  font-family: sans-serif;
  font-size: 16px;
  display: flex;
`;
