// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { Plugin, Plug, Slot } from 'react-plugin';
import { PlaygroundContext } from '../../context';
import { PropsPanel } from './PropsPanel';
import { StatePanel } from './StatePanel';

import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { RendererRequest } from 'react-cosmos-shared2/renderer';

type Props = {
  fixturePath: ?string,
  fixtureState: ?FixtureState,
  postRendererRequest: RendererRequest => mixed
};

class ControlPanel extends Component<Props> {
  render() {
    const { fixturePath, fixtureState, postRendererRequest } = this.props;

    if (!fixturePath || !fixtureState) {
      return null;
    }

    return (
      <>
        <PropsPanel
          fixturePath={fixturePath}
          fixtureState={fixtureState}
          postRendererRequest={postRendererRequest}
        />
        <StatePanel
          fixturePath={fixturePath}
          fixtureState={fixtureState}
          postRendererRequest={postRendererRequest}
        />
      </>
    );
  }
}

export default (
  <Plugin name="Preview">
    <Plug
      slot="preview"
      render={({ children }) => (
        <Container>
          <Left>
            <PlaygroundContext.Consumer>
              {({ uiState, fixtureState, postRendererRequest }) => (
                <ControlPanel
                  fixturePath={uiState.fixturePath}
                  fixtureState={fixtureState}
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
