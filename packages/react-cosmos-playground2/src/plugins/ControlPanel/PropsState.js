// @flow

// import styled from 'styled-components';
import React, { Component } from 'react';
import { RENDERER_ID } from 'react-cosmos-shared2/renderer';
import { replaceOrAddItem } from 'react-cosmos-shared2/util';
import {
  findCompFixtureState,
  updateCompFixtureState
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

export class PropsState extends Component<Props> {
  render() {
    const { fixtureState } = this.props;
    const { components } = fixtureState;

    if (!components) {
      return null;
    }

    return components.map(
      ({ decoratorId, elPath, componentName, props, state }) => (
        <div key={`${decoratorId}-${elPath}`}>
          <p>
            <strong>{componentName}</strong>
          </p>
          {props && (
            <div>
              <p>Props</p>
              {props.map(({ key, serializable, stringified }) => (
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
          )}
          {state && (
            <div>
              <p>State</p>
              {state.map(({ key, serializable, stringified }) => (
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
          )}
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
    const compFxState = findCompFixtureState(fixtureState, decoratorId, elPath);

    if (!compFxState || !compFxState.props) {
      console.warn(`Decorator instance id ${decoratorId} no longer exists`);
      return;
    }

    const { props } = compFxState;
    const components = updateCompFixtureState({
      fixtureState,
      decoratorId,
      elPath,
      props: replaceOrAddItem(props, value => value.key === key, {
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
          components
        }
      }
    });
  };

  createStateValueChangeHandler = (
    decoratorId: FixtureDecoratorId,
    elPath: string,
    key: string
  ) => (value: string) => {
    const { fixturePath, fixtureState, postRendererRequest } = this.props;
    const compFxState = findCompFixtureState(fixtureState, decoratorId, elPath);

    if (!compFxState || !compFxState.state) {
      console.warn(`Decorator id ${decoratorId} no longer exists`);
      return;
    }

    const { state } = compFxState;
    const components = updateCompFixtureState({
      fixtureState,
      decoratorId,
      elPath,
      state: replaceOrAddItem(state, value => value.key === key, {
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
          components
        }
      }
    });
  };
}
