// @flow

// import styled from 'styled-components';
import React, { Component } from 'react';
import { RENDERER_ID } from 'react-cosmos-shared2/renderer';
import { replaceOrAddItem } from 'react-cosmos-shared2/util';
import {
  getPropsFixtureState,
  updatePropsFixtureState,
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

export class PropsPanel extends Component<Props> {
  render() {
    const { fixtureState } = this.props;
    const { props } = fixtureState;

    if (!props) {
      return null;
    }

    return props.map(
      ({ decoratorId, elPath, componentName, values }) =>
        values.length > 0 && (
          <div key={decoratorId}>
            <p>
              <strong>Props</strong> ({componentName})
            </p>
            {values.map(({ key, serializable, stringified }) => (
              <ValueInput
                key={key}
                id={`${decoratorId}-${elPath}-${key}`}
                label={key}
                value={stringified}
                disabled={!serializable}
                onChange={this.createPropValueChangeHandler(
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

  createPropValueChangeHandler = (
    decoratorId: FixtureDecoratorId,
    elPath: string,
    key: string
  ) => (value: string) => {
    const { fixturePath, fixtureState, postRendererRequest } = this.props;
    const [propsFxState] = getPropsFixtureState(
      fixtureState,
      createElFxStateMatcher(decoratorId, elPath)
    );

    if (!propsFxState) {
      console.warn(`Props instance id ${decoratorId} no longer exists`);
      return;
    }

    const { values } = propsFxState;
    const props = updatePropsFixtureState({
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
          props
        }
      }
    });
  };
}
