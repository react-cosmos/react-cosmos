// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { PlaygroundContext } from '../../PlaygroundContext';
import { getPrimaryRendererState } from '../RendererMessageHandler/selectors';
import { PropsState } from './PropsState';

import type { RendererId } from 'react-cosmos-shared2/renderer';
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
    const renderersState = getState('renderers');
    const { primaryRendererId, renderers } = renderersState;
    const primaryRendererState = getPrimaryRendererState(renderersState);

    if (!primaryRendererState) {
      return null;
    }

    const rendererIds = Object.keys(renderers);
    const { fixtureState } = primaryRendererState;
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
                  <small
                    onClick={this.createRendererSelectHandler(rendererId)}
                    style={{
                      cursor: 'pointer',
                      fontWeight:
                        rendererId === primaryRendererId ? 'bold' : 'normal'
                    }}
                  >
                    {rendererId}
                  </small>
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

  createRendererSelectHandler = (rendererId: RendererId) => () => {
    this.context.setState('renderers', prevState => ({
      ...prevState,
      primaryRendererId: rendererId
    }));
  };
}

const Container = styled.div`
  flex-shrink: 0;
  width: 256px;
  display: flex;
  flex-direction: column;
`;
