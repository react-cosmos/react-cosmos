// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { PluginContext } from '../../plugin';

import type { Node } from 'react';
import type { PluginContextValue } from '../../plugin';
import type { UrlParams } from '../Router';
import type { ResponsivePreviewState } from './shared';

type Props = {
  children: Node
};

export class ResponsivePreview extends Component<Props> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  getOwnState(): ResponsivePreviewState {
    return this.context.getState('responsive-preview');
  }

  getUrlParams(): UrlParams {
    return this.context.getState('router').urlParams;
  }

  render() {
    const { children } = this.props;
    const { enabled } = this.getOwnState();
    const { fullScreen } = this.getUrlParams();

    // We don't simply do `return children` because it would cause a flicker
    // whenever switching between responsive and non responsive mode. By
    // returning the same element nesting between states for Preview the
    // transition is seamless.
    if (!enabled || fullScreen) {
      return (
        <Container>
          <Preview key="preview">{children}</Preview>
        </Container>
      );
    }

    return (
      <Container>
        <Header data-testid="responsive-header">
          Responsive controls go here
        </Header>
        <Preview key="preview">{children}</Preview>
      </Container>
    );
  }
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div``;

const Preview = styled.div`
  flex: 1;
`;
