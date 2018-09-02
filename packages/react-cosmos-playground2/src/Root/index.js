// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { Slot } from 'react-plugin';
import { removeItem, updateState } from 'react-cosmos-shared2/util';
import { defaultUiState, PlaygroundContext } from '../context';

import type { SetState } from 'react-cosmos-shared2/util';
import type { RendererRequest } from 'react-cosmos-shared2/renderer';
import type {
  PlaygroundOptions,
  UiState,
  ReplaceFixtureState,
  RendererRequestListener,
  PlaygroundContextValue
} from '../index.js.flow';

type Props = {
  options: PlaygroundOptions
};

export class Root extends Component<Props, PlaygroundContextValue> {
  requestListeners: RendererRequestListener[] = [];

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

  postRendererRequest = (msg: RendererRequest) => {
    this.requestListeners.forEach(listener => {
      listener(msg);
    });
  };

  onRendererRequest = (listener: RendererRequestListener) => {
    this.requestListeners.push(listener);

    return () => {
      this.requestListeners = removeItem(this.requestListeners, listener);
    };
  };

  state = {
    options: this.props.options,
    uiState: defaultUiState,
    setUiState: this.setUiState,
    fixtureState: null,
    replaceFixtureState: this.replaceFixtureState,
    postRendererRequest: this.postRendererRequest,
    onRendererRequest: this.onRendererRequest
  };

  render() {
    const {
      uiState: { renderers }
    } = this.state;

    return (
      <PlaygroundContext.Provider value={this.state}>
        <Container>
          {renderers.length === 0 && <p>Waiting for renderer...</p>}
          <Slot name="root">
            <Slot name="preview" />
          </Slot>
        </Container>
      </PlaygroundContext.Provider>
    );
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
