import { isEqual } from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { Device, Viewport } from '../public';
import { Header } from './Header';
import { getViewportScaleFactor, getStyles, stretchStyle } from './style';

type Props = {
  children: React.ReactNode;
  devices: Device[];
  enabled: boolean;
  viewport: Viewport;
  scaled: boolean;
  fullScreen: boolean;
  validFixtureSelected: boolean;
  setViewport(viewport: Viewport): unknown;
  setScaled(scaled: boolean): unknown;
};

type State = {
  container: null | Viewport;
};

export class ResponsivePreview extends React.Component<Props, State> {
  state: State = {
    container: null
  };

  containerEl: null | HTMLElement = null;

  render() {
    const {
      children,
      devices,
      enabled,
      viewport,
      scaled,
      fullScreen,
      validFixtureSelected
    } = this.props;
    const { container } = this.state;

    // We don't simply do `return children` because it would cause a flicker
    // whenever switching between responsive and non responsive mode. By
    // returning the same element nesting between states for Preview the
    // component instances are preserved and the transition is seamless.
    if (!validFixtureSelected || fullScreen || !enabled || !container) {
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
    this.props.setScaled(!this.props.scaled);
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
