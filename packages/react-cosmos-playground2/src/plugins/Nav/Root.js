// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { PlaygroundContext } from '../../PlaygroundContext';
import { Nav } from './Nav';

import type { Node } from 'react';
import type { PlaygroundContextValue } from '../../index.js.flow';
import type { RouterState } from '../Router';

type Props = {
  children: Node
};

export class Root extends Component<Props> {
  static contextType = PlaygroundContext;

  // https://github.com/facebook/flow/issues/7166
  context: PlaygroundContextValue;

  render() {
    const { children } = this.props;
    const { fullscreen }: RouterState = this.context.getState('router');

    const content = (
      <Content data-testid="content" key="right">
        {children}
      </Content>
    );

    if (fullscreen) {
      return <Container>{content}</Container>;
    }

    return (
      <Container>
        <Nav />
        {content}
      </Container>
    );
  }
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
