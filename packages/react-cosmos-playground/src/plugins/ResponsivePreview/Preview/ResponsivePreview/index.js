// @flow

import React, { Component } from 'react';
import { isEqual } from 'lodash';
import Header from './Header';
import classNames from 'classnames';
import styles from './index.less';

import type { Node } from 'react';
import type { Viewport } from '../../types';

type Props = {
  children: Node,
  devices: Array<{| label: string, width: number, height: number |}>,
  viewport: ?Viewport,
  onViewportChange: Viewport => any
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

export class ResponsivePreview extends Component<Props, State> {
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

  handleViewportChange = (width: number, height: number) => {
    const { onViewportChange } = this.props;
    onViewportChange({ width, height });
  };

  handleScaleChange = (scale: boolean) => {
    this.setState({ scale });
  };

  render() {
    const { children, devices, viewport } = this.props;
    const { container: outerContainer, scale } = this.state;

    // We can't simply say
    //   if (!viewport) { return children };
    // because this causes flicker when switching between responsive and
    // non responsive mode as the React component tree is completely different.
    // The key to preserving the child iframe is the "preview" key.
    if (!viewport || !outerContainer) {
      return (
        <div>
          <div
            key="preview"
            ref={this.handleContainerRef}
            style={{ display: 'flex' }}
          >
            <div>
              <div>{children}</div>
            </div>
          </div>
        </div>
      );
    }

    const container = {
      width: outerContainer.width - 2 * (PADDING + BORDER_WIDTH),
      height: outerContainer.height - 2 * (PADDING + BORDER_WIDTH)
    };
    const { width, height } = viewport;

    const scaleWidth = Math.min(1, container.width / width);
    const scaleHeight = Math.min(1, container.height / height);
    const scaleFactor = scale ? Math.min(scaleWidth, scaleHeight) : 1;
    const scaledWidth = width * scaleFactor;
    const scaledHeight = height * scaleFactor;

    const outerWrapperStyle = {
      display: scale ? 'flex' : 'block',
      padding: PADDING,
      overflow: scale ? 'hidden' : 'scroll'
    };

    const middleWrapperClassName = '';
    const middleWrapperStyle = {
      lineHeight: 0,
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
      alignSelf: scaleHeight === 1 ? 'center' : 'flex-start',
      justifySelf: scaleWidth === 1 ? 'center' : 'flex-start',
      transform: `scale( ${scaleFactor} )`
    };

    return (
      <div className={styles.container}>
        {viewport && (
          <Header
            devices={devices}
            dimensions={{
              width: viewport.width,
              height: viewport.height,
              scale
            }}
            containerWidth={container.width}
            containerHeight={container.height}
            onViewportChange={this.handleViewportChange}
            setScale={this.handleScaleChange}
          />
        )}
        <div
          key="preview"
          className={styles.outerWrapper}
          ref={this.handleContainerRef}
          style={outerWrapperStyle}
        >
          <div className={middleWrapperClassName} style={middleWrapperStyle}>
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
