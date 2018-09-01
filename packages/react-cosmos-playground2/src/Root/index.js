// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { Slot } from 'react-plugin';
import { removeItem, updateState } from 'react-cosmos-shared2/util';
import { RENDERER_ID } from 'react-cosmos-shared2/renderer';
import {
  updateFixtureStateProps,
  updateFixtureStateState
} from 'react-cosmos-shared2/fixtureState';
import { PlaygroundContext } from '../context';

import type { SetState } from 'react-cosmos-shared2/util';
import type { RendererRequest } from 'react-cosmos-shared2/renderer';
import type {
  PlaygroundOptions,
  UiState,
  ReplaceFixtureState,
  RendererRequestListener,
  PlaygroundContextValue
} from '../../types';

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
    uiState: {
      fixturePath: null,
      fixtures: []
    },
    setUiState: this.setUiState,
    fixtureState: null,
    replaceFixtureState: this.replaceFixtureState,
    postRendererRequest: this.postRendererRequest,
    onRendererRequest: this.onRendererRequest
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
          {fixtureState &&
            fixtureState.state &&
            fixtureState.state.map(({ instanceId, values }) =>
              values.map(({ key, value, serializable }) => (
                <div key={key}>
                  {key}:{' '}
                  <input
                    type="text"
                    value={value}
                    disabled={!serializable}
                    onChange={this.createStateValueChangeHandler(
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

    this.postRendererRequest({
      type: 'setFixtureState',
      payload: {
        rendererId: RENDERER_ID,
        fixturePath,
        fixtureStateChange: {
          props: updateFixtureStateProps(fixtureState, instanceId, {
            [key]: value
          })
        }
      }
    });
  };

  createStateValueChangeHandler = (instanceId: number, key: string) => (
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

    this.postRendererRequest({
      type: 'setFixtureState',
      payload: {
        rendererId: RENDERER_ID,
        fixturePath,
        fixtureStateChange: {
          state: updateFixtureStateState(fixtureState, instanceId, {
            // TODO: Rely on pre-established type
            [key]: isNaN(value) ? value : Number(value)
          })
        }
      }
    });
  };

  // TODO: Extract common arts of createPropValueChangeHandler and
  // createStateValueChangeHandler in `postFixtureStateChange`

  createFixtureSelectHandler = (fixturePath: string) => () => {
    this.setUiState({ fixturePath });

    this.postRendererRequest({
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
