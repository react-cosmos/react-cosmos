// @flow

import React, { Component } from 'react';
import { isEqual } from 'lodash';
import { Header } from './Header';
import classNames from 'classnames';
import {
  getPluginConfig,
  getPluginState,
  setPluginState,
  getFixtureViewport,
  storeViewportInBrowserHistory
} from '../shared';
import styles from './index.less';

import type { Node } from 'react';
import type { UiContextParams } from '../../../context';
import type { Viewport } from '../types';

type Props = {
  children: Node,
  uiContext: UiContextParams
};

type State = {
  container: ?{
    width: number,
    height: number
  },
  scale: boolean
};

const PADDING = 16;
const BORDER_WIDTH = 2;

export class Preview extends Component<Props, State> {
  state = {
    container: null,
    scale: true
  };

  containerEl: ?HTMLElement;

  componentDidUpdate() {
    const container = getContainerSize(this.containerEl);

    if (!isEqual(container, this.state.container)) {
      this.setState({
        container
      });
    }
  }

  handleContainerRef = (el: ?HTMLElement) => {
    this.containerEl = el;
  };

  handleViewportChange = (viewport: Viewport) => {
    const { uiContext } = this.props;
    const { state, editFixture } = uiContext;

    const pluginState = getPluginState(uiContext);

    editFixture({
      ...state.fixtureBody,
      viewport
    });

    setPluginState(
      uiContext,
      pluginState.enabled
        ? { enabled: true, viewport }
        : { enabled: false, viewport }
    );

    storeViewportInBrowserHistory(viewport);
  };

  handleScaleChange = (scale: boolean) => {
    this.setState({ scale });
  };

  render() {
    const { children, uiContext } = this.props;
    const { options } = uiContext;

    if (options.platform !== 'web') {
      return children;
    }

    const { devices } = getPluginConfig(uiContext);
    const pluginState = getPluginState(uiContext);
    const fixtureViewport = getFixtureViewport(uiContext);

    const { container, scale } = this.state;
    const viewport =
      fixtureViewport || (pluginState.enabled && pluginState.viewport);

    // We can't simply say
    //   if (!viewport) { return children };
    // because this causes flicker when switching between responsive and
    // non responsive mode as the React component tree is completely different.
    // The key to preserving the child iframe is the "preview" key.
    if (!container || !viewport) {
      return (
        <div className={styles.container}>
          <div key="preview" ref={this.handleContainerRef}>
            <div>
              <div>{children}</div>
            </div>
          </div>
        </div>
      );
    }

    const innerContainer = {
      width: container.width - 2 * (PADDING + BORDER_WIDTH),
      height: container.height - 2 * (PADDING + BORDER_WIDTH)
    };
    const { width, height } = viewport;

    const scaleWidth = Math.min(1, innerContainer.width / width);
    const scaleHeight = Math.min(1, innerContainer.height / height);
    const scaleFactor = scale ? Math.min(scaleWidth, scaleHeight) : 1;
    const scaledWidth = width * scaleFactor;
    const scaledHeight = height * scaleFactor;

    const outerWrapperStyle = {
      justifyContent: scale || scaleWidth === 1 ? 'space-around' : 'flex-start',
      alignItems: scale || scaleHeight === 1 ? 'center' : 'flex-start',
      padding: PADDING,
      overflow: scale ? 'hidden' : 'scroll'
    };

    const middleWrapperStyle = {
      width: scaledWidth + 2 * BORDER_WIDTH,
      height: scaledHeight + 2 * BORDER_WIDTH
    };

    const innerWrapperClassName = classNames(
      styles.innerWrapper,
      styles.checkerboard
    );
    const innerWrapperStyle = {
      borderWidth: BORDER_WIDTH,
      width: width + 2 * BORDER_WIDTH,
      height: height + 2 * BORDER_WIDTH,
      transform: `scale( ${scaleFactor} )`
    };

    return (
      <div className={styles.container}>
        <Header
          devices={devices}
          viewport={viewport}
          container={container}
          scale={scale}
          changeViewport={this.handleViewportChange}
          setScale={this.handleScaleChange}
        />
        <div
          key="preview"
          className={styles.outerWrapper}
          ref={this.handleContainerRef}
          style={outerWrapperStyle}
        >
          <div style={middleWrapperStyle}>
            <div className={innerWrapperClassName} style={innerWrapperStyle}>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function getContainerSize(containerEl: ?HTMLElement) {
  if (!containerEl) {
    return null;
  }

  const { width, height } = containerEl.getBoundingClientRect();

  return { width, height };
}
