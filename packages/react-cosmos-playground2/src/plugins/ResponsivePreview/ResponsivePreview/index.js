// @flow
/* eslint-env browser */

import React, { Component } from 'react';
import { isEqual } from 'lodash';
import styled from 'styled-components';
import { PluginContext } from '../../../plugin';
import { getUrlParams } from '../../Router/selectors';
import {
  getResponsivePreviewState,
  getFixtureViewport,
  setFixtureStateViewport
} from '../shared';
import { storeViewport } from '../storage';
import { Header } from './Header';
import { stretchStyle, getStyles } from './style';

import type { Node } from 'react';
import type { SetState } from 'react-cosmos-shared2/util';
import type { PluginContextValue } from '../../../plugin';
import type { UrlParams } from '../../Router';
import type {
  Viewport,
  ResponsivePreviewConfig,
  ResponsivePreviewState
} from '../shared';

type Props = {
  children: Node
};

type State = {
  container: null | {
    width: number,
    height: number
  },
  scale: boolean
};

export class ResponsivePreview extends Component<Props, State> {
  static contextType = PluginContext;

  // https://github.com/facebook/flow/issues/7166
  context: PluginContextValue;

  state = {
    container: null,
    scale: true
  };

  containerEl: ?HTMLElement;

  getOwnConfig(): ResponsivePreviewConfig {
    return this.context.getConfig('responsive-preview');
  }

  getOwnState() {
    return getResponsivePreviewState(this.context);
  }

  setOwnState: SetState<ResponsivePreviewState> = (stateChange, cb) => {
    this.context.setState('responsive-preview', stateChange, cb);
  };

  render() {
    const { children } = this.props;
    const { container, scale } = this.state;
    const { fixturePath, fullScreen } = getUrlParams(this.context);
    const viewport = getViewport(this.context);

    // We don't simply do `return children` because it would cause a flicker
    // whenever switching between responsive and non responsive mode. By
    // returning the same element nesting between states for Preview the
    // component instances are preserved and the transition is seamless.
    if (!fixturePath || fullScreen || !viewport || !container) {
      return (
        <Container>
          <Preview key="preview" ref={this.handleContainerRef}>
            <div style={stretchStyle}>
              <div style={stretchStyle}>{children}</div>
            </div>
          </Preview>
        </Container>
      );
    }

    const { devices } = this.getOwnConfig();
    const {
      outerWrapperStyle,
      middleWrapperStyle,
      innerWrapperStyle
    } = getStyles({ container, viewport, scale });

    return (
      <Container>
        <Header
          devices={devices}
          viewport={viewport}
          scale={scale}
          createSelectViewportHandler={this.createSelectViewportHandler}
          toggleScale={this.toggleScale}
        />
        <Preview
          key="preview"
          ref={this.handleContainerRef}
          style={outerWrapperStyle}
        >
          <div style={middleWrapperStyle}>
            <div style={innerWrapperStyle}>{children}</div>
          </div>
        </Preview>
      </Container>
    );
  }

  handleContainerRef = (el: ?HTMLElement) => {
    this.containerEl = el;
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
    this.updateContainerSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate() {
    this.updateContainerSize();
  }

  handleWindowResize = () => {
    this.updateContainerSize();
  };

  createSelectViewportHandler = (viewport: Viewport) => () => {
    this.setOwnState({ enabled: true, viewport }, () => {
      setFixtureStateViewport(this.context);
      storeViewport(this.context);
    });
  };

  toggleScale = () => {
    this.setState(({ scale }) => ({ scale: !scale }));
  };

  updateContainerSize() {
    const container = getContainerSize(this.containerEl);

    if (!isEqual(container, this.state.container)) {
      this.setState({
        container
      });
    }
  }
}

function getContainerSize(containerEl: ?HTMLElement) {
  if (!containerEl) {
    return null;
  }

  const { width, height } = containerEl.getBoundingClientRect();

  return { width, height };
}

function getViewport(context: PluginContextValue): null | Viewport {
  const { enabled, viewport } = getResponsivePreviewState(context);

  return getFixtureViewport(context) || (enabled ? viewport : null);
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const Preview = styled.div`
  flex: 1;
`;
