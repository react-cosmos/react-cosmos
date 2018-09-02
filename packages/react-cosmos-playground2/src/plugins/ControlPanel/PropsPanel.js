// @flow

// import styled from 'styled-components';
import React, { Component } from 'react';
import { RENDERER_ID } from 'react-cosmos-shared2/renderer';
import { updateFixtureStateProps } from 'react-cosmos-shared2/fixtureState';
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
            {values.map(({ key, serializable, value }) => (
              <ValueInput
                key={key}
                label={key}
                value={value}
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
  ) => (value: mixed) => {
    const { fixturePath, fixtureState, postRendererRequest } = this.props;

    postRendererRequest({
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
}
