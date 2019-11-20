import React from 'react';
import styled from 'styled-components';
import { Cosmonaut } from './Cosmonaut/Cosmonaut';
import { Viewport } from './shared';

const HEADER_SIZE = 128;
const HEADER_PADDING = 16;

type Props = {
  windowViewport: Viewport;
  cropRatio: number;
  minimizeRatio: number;
};

export function Header({ cropRatio, windowViewport, minimizeRatio }: Props) {
  const headerPadding = Math.round(HEADER_PADDING * minimizeRatio);
  const containerViewport = getContainerViewport(windowViewport, minimizeRatio);
  const cosmonautViewport = getCosmonautViewport(windowViewport, minimizeRatio);
  const bottomOffset = getCosmonautBottomOffset(windowViewport, minimizeRatio);

  return (
    <Container
      style={{
        width: containerViewport.width,
        height: containerViewport.height + 2 * headerPadding
      }}
    >
      <CosmonautContainer
        style={{
          width: cosmonautViewport.width,
          height: cosmonautViewport.height,
          bottom: bottomOffset + headerPadding,
          left: headerPadding
        }}
      >
        <Cosmonaut cropRatio={cropRatio} minimizeRatio={minimizeRatio} />
      </CosmonautContainer>
    </Container>
  );
}

function getViewportLength(viewport: Viewport) {
  return Math.max(viewport.width, viewport.height);
}

function getCosmonautSize(windowViewport: Viewport) {
  return getViewportLength(windowViewport) / 3;
}

function getMinimizedCosmonautSize(
  windowViewport: Viewport,
  minimizeRatio: number
) {
  const fullSize = getCosmonautSize(windowViewport);
  return Math.round(fullSize - (fullSize - HEADER_SIZE) * minimizeRatio);
}

function getContainerViewport(windowViewport: Viewport, minimizeRatio: number) {
  if (minimizeRatio > 0) {
    const cosmonautSize = getMinimizedCosmonautSize(
      windowViewport,
      minimizeRatio
    );
    const height = Math.round(
      windowViewport.height -
        (windowViewport.height - cosmonautSize) * minimizeRatio
    );
    return { width: windowViewport.width, height };
  }
  return windowViewport;
}

function getCosmonautViewport(windowViewport: Viewport, minimizeRatio: number) {
  if (minimizeRatio > 0) {
    const cosmonautSize = getMinimizedCosmonautSize(
      windowViewport,
      minimizeRatio
    );
    return { width: cosmonautSize, height: cosmonautSize };
  }

  const width = getViewportLength(windowViewport);
  return { width, height: Math.ceil(getCosmonautSize(windowViewport) * 4) };
}

function getCosmonautBottomOffset(
  windowViewport: Viewport,
  minimizeRatio: number
) {
  return minimizeRatio > 0 ? 0 : -Math.floor(getCosmonautSize(windowViewport));
}

const Container = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background: #fff;
`;

const CosmonautContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`;
