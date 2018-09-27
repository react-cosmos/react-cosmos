// @flow

// import styled from 'styled-components';
import React, { Component } from 'react';
import { RENDERER_ID } from 'react-cosmos-shared2/renderer';
import { replaceOrAddItem } from 'react-cosmos-shared2/util';
import {
  getStateFixtureState,
  updateStateFixtureState,
  createElFxStateMatcher
} from 'react-cosmos-shared2/fixtureState';
import { ValueInput } from './ValueInput';

import type {
  FixtureDecoratorId,
  FixtureState
} from 'react-cosmos-shared2/fixtureState';
import type { RendererRequest } from 'react-cosmos-shared2/renderer';

type Props = {
  fixturePath: string,
  fixtureState: FixtureState,
  postRendererRequest: RendererRequest => mixed
};

export class StatePanel extends Component<Props> {
  render() {
    const { fixtureState } = this.props;
    const { state } = fixtureState;

    if (!state) {
      return null;
    }

    // TODO: Show elPath
    return state.map(
      ({ decoratorId, elPath, componentName, values }) =>
        values.length > 0 && (
          <div key={`${decoratorId}-${elPath}`}>
            <p>
              <strong>State</strong> ({componentName})
            </p>
            {values.map(({ key, serializable, stringified }) => (
              <ValueInput
                key={key}
                id={`${decoratorId}-${elPath}-${key}`}
                label={key}
                value={stringified}
                disabled={!serializable}
                onChange={this.createStateValueChangeHandler(
                  decoratorId,
                  elPath,
                  key
                )}
              />
            ))}
          </div>
        )
    );
  }

  createStateValueChangeHandler = (
    decoratorId: FixtureDecoratorId,
    elPath: string,
    key: string
  ) => (value: string) => {
    const { fixturePath, fixtureState, postRendererRequest } = this.props;
    const [stateFxState] = getStateFixtureState(
      fixtureState,
      createElFxStateMatcher(decoratorId, elPath)
    );

    if (!stateFxState) {
      console.warn(`State instance id ${decoratorId} no longer exists`);
      return;
    }

    const { values } = stateFxState;
    const state = updateStateFixtureState({
      fixtureState,
      decoratorId,
      elPath,
      values: replaceOrAddItem(values, value => value.key === key, {
        serializable: true,
        key,
        stringified: value
      })
    });

    postRendererRequest({
      type: 'setFixtureState',
      payload: {
        rendererId: RENDERER_ID,
        fixturePath,
        fixtureStateChange: {
          state
        }
      }
    });
  };
}
