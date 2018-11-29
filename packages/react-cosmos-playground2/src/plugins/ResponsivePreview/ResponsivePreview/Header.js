// @flow

import React, { Component } from 'react';
import styled from 'styled-components';

import type { Viewport, Device } from '../shared';

type Props = {
  devices: Device[],
  viewport: Viewport,
  scale: boolean,
  createSelectViewportHandler: Viewport => () => mixed,
  toggleScale: () => mixed
};

export class Header extends Component<Props> {
  render() {
    const {
      devices,
      viewport,
      scale,
      createSelectViewportHandler,
      toggleScale
    } = this.props;

    return (
      <Container data-testid="responsive-header">
        {devices.map(({ label, width, height }, idx) => {
          const isSelected =
            viewport && viewport.width === width && viewport.height === height;

          return (
            <button
              key={idx}
              disabled={isSelected}
              onClick={createSelectViewportHandler({ width, height })}
            >
              {label}
            </button>
          );
        })}
        <label style={{ userSelect: 'none' }}>
          <input type="checkbox" checked={scale} onChange={toggleScale} />
          scale
        </label>
      </Container>
    );
  }
}

const Container = styled.div``;
