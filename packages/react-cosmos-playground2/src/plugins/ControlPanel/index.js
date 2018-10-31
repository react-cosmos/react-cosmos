// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { register, Plugin, Plug, Slot } from 'react-plugin';
import qs from 'query-string';
import { PlaygroundContext } from '../../context';
import { PropsState } from './PropsState';

import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type { RendererRequest } from 'react-cosmos-shared2/renderer';

type Props = {
  rendererUrl: string,
  fixturePath: ?string,
  fixtureState: ?FixtureState,
  postRendererRequest: RendererRequest => mixed
};

class ControlPanel extends Component<Props> {
  render() {
    const {
      rendererUrl,
      fixturePath,
      fixtureState,
      postRendererRequest
    } = this.props;

    if (!fixturePath || !fixtureState) {
      return null;
    }

    const fullScreenUrl = `${rendererUrl}?${qs.stringify({ f: fixturePath })}`;

    return (
      <>
        <a href={fullScreenUrl}>Full screen</a>
        <PropsState
          fixturePath={fixturePath}
          fixtureState={fixtureState}
          postRendererRequest={postRendererRequest}
        />
      </>
    );
  }
}

register(
  <Plugin name="Preview">
    <Plug
      slot="preview"
      render={({ children }) => (
        <Container>
          <Left>
            <PlaygroundContext.Consumer>
              {({ options, uiState, fixtureState, postRendererRequest }) => (
                <ControlPanel
                  rendererUrl={options.rendererUrl}
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
