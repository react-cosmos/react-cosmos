// @flow

import styled from 'styled-components';
import React, { Component } from 'react';
import { register, Plugin, Plug } from 'react-plugin';
import { PlaygroundContext } from '../../PlaygroundContext';
import { FixtureTree } from './FixtureTree';

import type { Node } from 'react';
import type { PlaygroundContextValue } from '../../index.js.flow';

type Props = {
  children: Node
};

type UrlParams = {
  fixture?: string,
  fullscreen?: boolean
};

class Root extends Component<Props> {
  static contextType = PlaygroundContext;

  // FIXME: React team, why is this needed with static contextType?
  context: PlaygroundContextValue;

  render() {
    const { children } = this.props;
    const { fullscreen }: UrlParams = this.context.state.router || {};

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

class Nav extends Component<{}> {
  static contextType = PlaygroundContext;

  // FIXME: React team, why is this needed with static contextType?
  context: PlaygroundContextValue;

  render() {
    const {
      core: { fixtures },
      router
    } = this.context.state;
    // FIXME: Should this be read from state or from router.getUrlParams method?
    // It needs to be reactive.
    const { fixture }: UrlParams = router || {};

    return (
      <NavContainer data-testid="nav">
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
