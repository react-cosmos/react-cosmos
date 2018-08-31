// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { Slot } from 'react-plugin';
import {
  RENDERER_ID,
  remoteItem,
  updateState,
  setFixtureStateProps
} from 'react-cosmos-shared2';
import { PlaygroundContext } from '../context';

import type {
  SetState,
  FixtureState,
  RemoteMessage
} from 'react-cosmos-shared2';
import type {
  PlaygroundOptions,
  UiState,
  RemoteListener,
  OnRemoteMessage,
  PlaygroundContextValue
} from '../../types';

type Props = {
  options: PlaygroundOptions
};

export class Root extends Component<Props, PlaygroundContextValue> {
  remoteListeners: RemoteListener[] = [];

  onMessage: OnRemoteMessage = listener => {
    this.remoteListeners.push(listener);

    return () => {
      this.remoteListeners = remoteItem(this.remoteListeners, listener);
    };
  };

  setUiState: SetState<UiState> = (stateChange, cb) => {
    this.setState(
      ({ uiState }) => ({
        uiState: updateState(uiState, stateChange)
      }),
      cb
    );
  };

  setFixtureState: SetState<FixtureState> = (stateChange, cb) => {
    this.setState(
      ({ fixtureState }) => ({
        fixtureState: updateState(fixtureState, stateChange)
      }),
      cb
    );
  };

  postMessage = (msg: RemoteMessage) => {
    this.remoteListeners.forEach(listener => {
      listener(msg);
    });
  };

  state = {
    options: this.props.options,
    uiState: {
      fixturePath: null,
      fixtures: []
    },
    setUiState: this.setUiState,
    fixtureState: null,
    setFixtureState: this.setFixtureState,
    postMessage: this.postMessage,
    onMessage: this.onMessage
  };

  render() {
    const { uiState, fixtureState } = this.state;

    // TODO: Extract plugins:
    // - FixtureList
    // - FixtureControlPanel
    return (
      <PlaygroundContext.Provider value={this.state}>
        <Container>
          {!fixtureState && 'Waiting for renderer...'}
          {fixtureState &&
            fixtureState.props &&
            fixtureState.props.map(({ instanceId, values }) =>
              values.map(({ key, value, serializable }) => (
                <div key={key}>
                  {key}:{' '}
                  <input
                    type="text"
                    value={value}
                    disabled={!serializable}
                    onChange={this.createPropValueChangeHandler(
                      instanceId,
                      key
                    )}
                  />
                </div>
              ))
            )}
          <ul>
            {uiState.fixtures.map((fixturePath, idx) => (
              <li key={idx}>
                <button onClick={this.createFixtureSelectHandler(fixturePath)}>
                  {fixturePath}
                </button>
              </li>
            ))}
          </ul>
          <Slot name="root">
            <Slot name="preview" />
          </Slot>
        </Container>
      </PlaygroundContext.Provider>
    );
  }

  createPropValueChangeHandler = (instanceId: number, key: string) => (
    e: SyntheticEvent<HTMLInputElement>
  ) => {
    const { value } = e.currentTarget;
    const { uiState, fixtureState } = this.state;
    const { fixturePath } = uiState;

    if (!fixturePath) {
      throw new Error(
        'Trying to set fixture state when no fixture is selected'
      );
    }

    this.postMessage({
      type: 'setFixtureState',
      payload: {
        rendererId: RENDERER_ID,
        fixturePath,
        // TODO: Only send fixtureState.props?
        fixtureState: setFixtureStateProps(fixtureState, instanceId, {
          [key]: value
        })
      }
    });
  };

  createFixtureSelectHandler = (fixturePath: string) => () => {
    this.setUiState({ fixturePath });

    this.postMessage({
      type: 'selectFixture',
      payload: {
        rendererId: RENDERER_ID,
        fixturePath
      }
    });
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
