// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { register, Plugin, Plug } from 'react-plugin';
import { RENDERER_ID } from 'react-cosmos-shared2/renderer';
import { PlaygroundContext } from '../../PlaygroundContext';
import { FixtureTree } from './FixtureTree';

class Nav extends Component<{}> {
  static contextType = PlaygroundContext;

  render() {
    const {
      uiState: { fixtures }
    } = this.context;

    return (
      <FixtureTree fixtures={fixtures} onSelect={this.handleFixtureSelect} />
    );
  }

  handleFixtureSelect = (fixturePath: string) => {
    const { setUiState, postRendererRequest } = this.context;

    setUiState({ fixturePath });
    postRendererRequest({
      type: 'selectFixture',
      payload: {
        // TODO: Use rendererIds from uiState
        rendererId: RENDERER_ID,
        fixturePath
      }
    });
  };
}

register(
  <Plugin name="Preview">
    <Plug
      slot="root"
      render={({ children }) => (
        <Container>
          <Left>
            <Nav />
          </Left>
          <Right>{children}</Right>
        </Container>
      )}
    />
  </Plugin>
);

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const Left = styled.div`
  flex-shrink: 0;
  width: 256px;
  display: flex;
  flex-direction: column;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
