// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { register, Plugin, Plug } from 'react-plugin';
import { PlaygroundContext } from '../../PlaygroundContext';
import { FixtureTree } from './FixtureTree';

import type { Node } from 'react';

type Props = {
  children: Node
};

class Root extends Component<Props> {
  static contextType = PlaygroundContext;

  render() {
    const { children } = this.props;
    const {
      urlParams: { fullscreen }
    } = this.context;

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
        <Nav data-testid="nav" />
        {content}
      </Container>
    );
  }
}

class Nav extends Component<{}> {
  static contextType = PlaygroundContext;

  render() {
    const {
      urlParams: { fixture },
      uiState: { fixtures }
    } = this.context;

    return (
      <NavContainer>
        {fixture && (
          <Buttons>
            <button onClick={this.handleGoHome}>home</button>
            <button onClick={this.handleGoFullScreen}>fullscreen</button>
          </Buttons>
        )}
        <FixtureTree fixtures={fixtures} onSelect={this.handleFixtureSelect} />
      </NavContainer>
    );
  }

  handleGoHome = () => {
    this.context.setUrlParams({ fixture: undefined });
  };

  handleFixtureSelect = (fixturePath: string) => {
    this.context.setUrlParams({ fixture: fixturePath });
  };

  handleGoFullScreen = () => {
    this.context.setUrlParams({ fullscreen: true });
  };
}

register(
  <Plugin name="Preview">
    <Plug slot="root" render={Root} />
  </Plugin>
);

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const NavContainer = styled.div`
  flex-shrink: 0;
  width: 256px;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
`;
