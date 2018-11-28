// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { PluginContext } from '../../plugin';

import type { Node } from 'react';
import type { SetState } from 'react-cosmos-shared2/util';
import type { PluginContextValue } from '../../plugin';
import type { UrlParams } from '../Router';
import type {
  Viewport,
  ResponsivePreviewConfig,
  ResponsivePreviewState
} from './shared';

type Props = {
  children: Node
};

export class ResponsivePreview extends Component<Props> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  getOwnConfig(): ResponsivePreviewConfig {
    return this.context.getConfig('responsive-preview');
  }

  getOwnState(): ResponsivePreviewState {
    return this.context.getState('responsive-preview');
  }

  setOwnState: SetState<ResponsivePreviewState> = (stateChange, cb) => {
    this.context.setState('responsive-preview', stateChange, cb);
  };

  getUrlParams(): UrlParams {
    return this.context.getState('router').urlParams;
  }

  render() {
    const { children } = this.props;
    const { enabled, viewport } = this.getOwnState();
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

    const { devices } = this.getOwnConfig();

    return (
      <Container>
        <Header data-testid="responsive-header">
          {devices.map(({ label, width, height }, idx) => {
            const isSelected =
              viewport &&
              viewport.width === width &&
              viewport.height === height;

            return (
              <button
                key={idx}
                disabled={isSelected}
                onClick={this.createSelectViewportHandler({ width, height })}
              >
                {label}
              </button>
            );
          })}
        </Header>
        <Preview key="preview">{children}</Preview>
      </Container>
    );
  }

  createSelectViewportHandler = (viewport: Viewport) => () => {
    this.setOwnState({ enabled: true, viewport });
  };
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
