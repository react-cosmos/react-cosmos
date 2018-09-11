// @flow

// import styled from 'styled-components';
import React, { Component } from 'react';
import { RENDERER_ID } from 'react-cosmos-shared2/renderer';
import { replaceOrAddItem } from 'react-cosmos-shared2/util';
import {
  getFixtureStatePropsInst,
  updateFixtureStateProps
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

export class PropsPanel extends Component<Props> {
  render() {
    const { fixtureState } = this.props;
    const { props } = fixtureState;

    if (!props) {
      return null;
    }

    return props.map(
      ({ instanceId, componentName, values }) =>
        values.length > 0 && (
          <div key={instanceId}>
            <p>
              <strong>Props</strong> ({componentName})
            </p>
            {values.map(({ key, serializable, stringified }) => (
              <ValueInput
                key={key}
                id={`${instanceId}-${key}`}
                label={key}
                value={stringified}
                disabled={!serializable}
                onChange={this.createPropValueChangeHandler(instanceId, key)}
              />
            ))}
          </div>
        )
    );
  }

  createPropValueChangeHandler = (
    instanceId: FixtureStateInstanceId,
    key: string
  ) => (value: string) => {
    const { fixturePath, fixtureState, postRendererRequest } = this.props;
    const propsInst = getFixtureStatePropsInst(fixtureState, instanceId);

    if (!propsInst) {
      console.warn(`Props instance id ${instanceId} no longer exists`);
      return;
    }

    const props = updateFixtureStateProps(
      fixtureState,
      instanceId,
      replaceOrAddItem(propsInst.values, value => value.key === key, {
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
          props
        }
      }
    });
  };
}
