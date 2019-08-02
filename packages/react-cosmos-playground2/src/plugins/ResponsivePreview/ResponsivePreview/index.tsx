import React from 'react';
import { isEqual } from 'lodash';
import styled from 'styled-components';
import { Header } from './Header';
import { stretchStyle, getStyles, getAvailableViewport } from './style';
import { Viewport, Device } from '../public';

type Props = {
  children: React.ReactNode;
  devices: Device[];
  viewport: null | Viewport;
  fullScreen: boolean;
  validFixtureSelected: boolean;
  setViewport(viewport: Viewport): unknown;
};

type State = {
  container: null | Viewport;
  scaled: boolean;
};

export class ResponsivePreview extends React.Component<Props, State> {
  state: State = {
    container: null,
    scaled: true
  };

  containerEl: null | HTMLElement = null;

  render() {
    const {
      children,
      devices,
      viewport,
      fullScreen,
      validFixtureSelected
    } = this.props;
    const { container, scaled } = this.state;

    // We don't simply do `return children` because it would cause a flicker
    // whenever switching between responsive and non responsive mode. By
    // returning the same element nesting between states for Preview the
    // component instances are preserved and the transition is seamless.
    if (!validFixtureSelected || fullScreen || !viewport || !container) {
      return (
        <Container>
          <div key="preview" ref={this.handleContainerRef} style={stretchStyle}>
            <div style={stretchStyle}>
              <div style={stretchStyle}>
                <div style={stretchStyle}>{children}</div>
              </div>
            </div>
          </div>
        </Container>
      );
    }

    const scaleFactor = getViewportScaleFactor(viewport, container);
    const {
      maskContainerStyle,
      padContainerStyle,
      alignContainerStyle,
      scaleContainerStyle
    } = getStyles({ container, viewport, scaled });
    return (
      <Container>
        <Header
          devices={devices}
          selectedViewport={viewport}
          scaleFactor={scaleFactor}
          scaled={scaled}
          selectViewport={this.props.setViewport}
          toggleScale={this.toggleScale}
        />
        <div
          key="preview"
          ref={this.handleContainerRef}
          style={maskContainerStyle}
        >
          <div style={padContainerStyle}>
            <div style={alignContainerStyle}>
              <div style={scaleContainerStyle}>{children}</div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  handleContainerRef = (el: null | HTMLElement) => {
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

  toggleScale = () => {
    this.setState(({ scaled }) => ({ scaled: !scaled }));
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

function getViewportScaleFactor(viewport: Viewport, container: Viewport) {
  const containerViewport = getAvailableViewport(container);
  return Math.min(
    Math.min(1, containerViewport.width / viewport.width),
    Math.min(1, containerViewport.height / viewport.height)
  );
}

function getContainerSize(containerEl: null | HTMLElement) {
  if (!containerEl) {
    return null;
  }

  const { width, height } = containerEl.getBoundingClientRect();
  return { width, height };
}

const Container = styled.div.attrs({ 'data-testid': 'responsivePreview' })`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  background: var(--grey6);
`;
