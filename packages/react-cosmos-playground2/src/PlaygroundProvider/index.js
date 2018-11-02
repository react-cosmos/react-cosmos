// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { removeItem, updateState } from 'react-cosmos-shared2/util';
import { defaultUiState, PlaygroundContext } from '../PlaygroundContext';

import type { Node } from 'react';
import type { SetState } from 'react-cosmos-shared2/util';
import type {
  RendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import type {
  PlaygroundOptions,
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
  setUiState: SetState<UiState> = (stateChange, cb) => {
    this.setState(
      ({ uiState }) => ({
        uiState: updateState(uiState, stateChange)
      }),
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

  unsubscribe: ?() => mixed;

  componentDidMount() {
    this.unsubscribe = this.onRendererResponse(this.handleRendererResponse);
  }

  componentWilMount() {
    if (typeof this.unsubscribe === 'function') {
      this.unsubscribe();
    }
  }

  handleRendererResponse = (msg: RendererResponse) => {
    const { uiState, setUiState, replaceFixtureState } = this.state;

    switch (msg.type) {
      case 'fixtureList': {
        const { rendererId, fixtures } = msg.payload;
        const { renderers } = uiState;

        return setUiState({
          renderers:
            renderers.indexOf(rendererId) === -1
              ? [...renderers, rendererId]
              : renderers,
          fixtures
        });
      }
      case 'fixtureState': {
        const { fixtureState } = msg.payload;

        return replaceFixtureState(fixtureState);
      }
      default:
      // No need to handle every message. Maybe some plugin cares about it.
    }
  };
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
