// @flow

// import styled from 'styled-components';
import React, { Component } from 'react';
import { RENDERER_ID } from 'react-cosmos-shared2/renderer';
import { replaceOrAddItem } from 'react-cosmos-shared2/util';
import {
  getFixtureStateStateInst,
  updateFixtureStateState
} from 'react-cosmos-shared2/fixtureState';
import { ValueInput } from './ValueInput';

import type {
  FixtureStateInstanceId,
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

    return state.map(
      ({ instanceId, componentName, values }) =>
        values.length > 0 && (
          <div key={instanceId}>
            <p>
              <strong>State</strong> ({componentName})
            </p>
            {values.map(({ key, serializable, stringified }) => (
              <ValueInput
                key={key}
                id={`${instanceId}-${key}`}
                label={key}
                value={stringified}
                disabled={!serializable}
                onChange={this.createStateValueChangeHandler(instanceId, key)}
              />
            ))}
          </div>
        )
    );
  }

  createStateValueChangeHandler = (
    instanceId: FixtureStateInstanceId,
    key: string
  ) => (value: string) => {
    const { fixturePath, fixtureState, postRendererRequest } = this.props;
    const stateInst = getFixtureStateStateInst(fixtureState, instanceId);

    if (!stateInst) {
      console.warn(`State instance id ${instanceId} no longer exists`);
      return;
    }

    const state = updateFixtureStateState(
      fixtureState,
      instanceId,
      replaceOrAddItem(stateInst.values, value => value.key === key, {
        serializable: true,
        key,
        stringified: value
      })
    );

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
