// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { register, Plugin, Plug, Slot } from 'react-plugin';
import { RENDERER_ID } from 'react-cosmos-shared2/renderer';
import { PlaygroundContext } from '../../context';
import { FixtureTree } from './FixtureTree';

import type { SetState } from 'react-cosmos-shared2/util';
import type {
  FixtureNames,
  RendererRequest
} from 'react-cosmos-shared2/renderer';
import type { UiState } from '../../index.js.flow';

type Props = {
  fixtures: FixtureNames,
  setUiState: SetState<UiState>,
  postRendererRequest: RendererRequest => mixed
};

class Nav extends Component<Props> {
  render() {
    const { fixtures } = this.props;

    return (
      <FixtureTree fixtures={fixtures} onSelect={this.handleFixtureSelect} />
    );
  }

  handleFixtureSelect = (fixturePath: string) => {
    const { setUiState, postRendererRequest } = this.props;

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
      slot="preview"
      render={({ children }) => (
        <Container>
          <Left>
            <PlaygroundContext.Consumer>
              {({ uiState, setUiState, postRendererRequest }) => (
                <Nav
                  fixtures={uiState.fixtures}
                  setUiState={setUiState}
                  postRendererRequest={postRendererRequest}
                />
              )}
            </PlaygroundContext.Consumer>
          </Left>
          <Right>
            <Slot name="preview">{children}</Slot>
          </Right>
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
