// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { PlaygroundContext } from '../../PlaygroundContext';
import { getSelRendererState } from '../RendererMessageHandler/selectors';
import { PropsState } from './PropsState';

import type { ComponentFixtureState } from 'react-cosmos-shared2/fixtureState';
import type { PlaygroundContextValue } from '../../index.js.flow';
import type { UrlParams } from '../Router';

type Props = {};

export class ControlPanel extends Component<Props> {
  static contextType = PlaygroundContext;

  // https://github.com/facebook/flow/issues/7166
  context: PlaygroundContextValue;

  render() {
    const { getState } = this.context;
    const rendererStates = getState('renderers');
    const rendererState = getSelRendererState(rendererStates);

    if (!rendererState) {
      return null;
    }

    const rendererIds = Object.keys(rendererStates);
    const { fixtureState } = rendererState;
    const { fixturePath, fullScreen }: UrlParams = getState('urlParams');

    if (fullScreen || !fixturePath || !fixtureState) {
      return null;
    }

    return (
      <Container>
        <PropsState
          fixtureState={fixtureState}
          setFixtureState={this.setFixtureState}
        />
        {rendererIds.length > 1 && (
          <div>
            <p>Renderers ({rendererIds.length})</p>
            <ul>
              {rendererIds.map(rendererId => (
                <li key={rendererId}>
                  <small>{rendererId}</small>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    );
  }

  setFixtureState = (components: ComponentFixtureState[]) => {
    this.context.callMethod('renderer.setFixtureState', fixtureState => ({
      ...fixtureState,
      components
    }));
  };
}

const Container = styled.div`
  flex-shrink: 0;
  width: 256px;
  display: flex;
  flex-direction: column;
`;
