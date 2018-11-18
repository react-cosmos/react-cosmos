// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { PlaygroundContext } from '../../PlaygroundContext';
import { PropsState } from './PropsState';

import type { ComponentFixtureState } from 'react-cosmos-shared2/fixtureState';
import type { PlaygroundContextValue } from '../../index.js.flow';
import type { RendererState } from '../RendererMessageHandler';
import type { UrlParams } from '../Router';

type Props = {};

export class ControlPanel extends Component<Props> {
  static contextType = PlaygroundContext;

  // https://github.com/facebook/flow/issues/7166
  context: PlaygroundContextValue;

  render() {
    const { getState } = this.context;
    const { fixtureState }: RendererState = getState('renderer');
    const { fixturePath, fullScreen }: UrlParams = getState('urlParams');

    if (fullScreen || !fixturePath || !fixtureState) {
      return null;
    }

    return (
      <Container>
        <PropsState
          fixturePath={fixturePath}
          fixtureState={fixtureState}
          setFixtureState={this.setFixtureState}
        />
      </Container>
    );
  }

  setFixtureState = ({
    fixturePath,
    components
  }: {
    fixturePath: string,
    components: ComponentFixtureState[]
  }) => {
    const { rendererIds }: RendererState = this.context.getState('renderer');

    rendererIds.forEach(rendererId => {
      this.context.emitEvent('renderer.request', {
        type: 'setFixtureState',
        payload: {
          rendererId,
          fixturePath,
          fixtureState: {
            components
          }
        }
      });
    });
  };
}

const Container = styled.div`
  flex-shrink: 0;
  width: 256px;
  display: flex;
  flex-direction: column;
`;
