// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { PlaygroundContext } from '../../PlaygroundContext';
import { FixtureTree } from './FixtureTree';

import type { PlaygroundContextValue } from '../../index.js.flow';
import type { RendererState } from '../RendererResponseHandler';
import type { RouterState } from '../Router';

export class Nav extends Component<{}> {
  static contextType = PlaygroundContext;

  // FIXME: React team, why is this needed with static contextType?
  context: PlaygroundContextValue;

  render() {
    const { state } = this.context;
    const { fixtures }: RendererState = state.renderer;
    const { fixture }: RouterState = state.router;

    return (
      <Container data-testid="nav">
        {fixture && (
          <Buttons>
            <button onClick={this.handleGoHome}>home</button>
            <button onClick={this.handleGoFullScreen}>fullscreen</button>
          </Buttons>
        )}
        <FixtureTree fixtures={fixtures} onSelect={this.handleFixtureSelect} />
      </Container>
    );
  }

  handleGoHome = () => {
    this.context.callMethod('router.setUrlParams', {});
  };

  handleFixtureSelect = (fixturePath: string) => {
    this.context.callMethod('router.setUrlParams', { fixture: fixturePath });
  };

  handleGoFullScreen = () => {
    const { fixture } = this.context.state.router;
    this.context.callMethod('router.setUrlParams', {
      fixture,
      fullscreen: true
    });
  };
}

const Container = styled.div`
  flex-shrink: 0;
  width: 256px;
  display: flex;
  flex-direction: column;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
`;
