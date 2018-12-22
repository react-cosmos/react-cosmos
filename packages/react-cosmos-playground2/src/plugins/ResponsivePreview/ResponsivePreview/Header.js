// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { Minimize2Icon } from '../../../shared/icons';
import { Button } from '../../../shared/components';
import { getAvailableViewport } from './style';

import type { Viewport, Device } from '../shared';

type Props = {
  devices: Device[],
  viewport: Viewport,
  container: Viewport,
  scale: boolean,
  createSelectViewportHandler: Viewport => () => mixed,
  toggleScale: () => mixed
};

export class Header extends Component<Props> {
  render() {
    const {
      devices,
      viewport,
      container,
      scale,
      createSelectViewportHandler,
      toggleScale
    } = this.props;
    const scaleFactor = getViewportScaleFactor(viewport, container);
    const isScalable = scaleFactor < 1;

    return (
      <Container data-testid="responsive-header">
        <Devices>
          {devices.map(({ label, width, height }, idx) => {
            const isSelected =
              viewport &&
              viewport.width === width &&
              viewport.height === height;

            return (
              <Button
                key={idx}
                label={label}
                disabled={isSelected}
                selected={isSelected}
                onClick={createSelectViewportHandler({ width, height })}
              />
            );
          })}
        </Devices>
        <Right>
          <ViewportSize>
            {`${viewport.width} × ${viewport.height}`}
          </ViewportSize>
          <Button
            disabled={!isScalable}
            icon={scale ? <Minimize2Icon /> : <Minimize2Icon />}
            label={
              <>
                scale
                {isScalable && (
                  <ScaleDegree>{getScalePercent(scaleFactor)}</ScaleDegree>
                )}
              </>
            }
            selected={isScalable && scale}
            onClick={toggleScale}
          />
        </Right>
      </Container>
    );
  }
}

function getViewportScaleFactor(viewport: Viewport, container: Viewport) {
  const { width, height } = getAvailableViewport(container);

  return Math.min(
    Math.min(1, width / viewport.width),
    Math.min(1, height / viewport.height)
  );
}

function getScalePercent(scaleFactor: number) {
  return `${Math.floor(scaleFactor * 100)}%`;
}

const Container = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  white-space: nowrap;
  overflow-x: auto;
`;

const Devices = styled.div`
  height: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ViewportSize = styled.div`
  margin: 0 8px;
  color: var(--grey3);
`;

const ScaleDegree = styled.span`
  margin-left: 3px;
  color: var(--grey3);

  ::before {
    content: '(';
  }
  ::after {
    content: ')';
  }
`;
