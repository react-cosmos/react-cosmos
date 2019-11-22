import React from 'react';
import styled from 'styled-components';
import { Cosmonaut } from './Cosmonaut/Cosmonaut';
import { FullScreenHeader } from './FullScreenHeader';
import { getCosmonautSize, getViewportLength, Viewport } from './shared';
import {
  MINIMIZED_HEADER_PADDING_PX,
  MINIMIZED_HEADER_SIZE_PX
} from './useHeaderScroll';

type Props = {
  windowViewport: Viewport;
  cropRatio: number;
  minimizeRatio: number;
};

export function Header({ windowViewport, cropRatio, minimizeRatio }: Props) {
  const headerPadding = Math.round(MINIMIZED_HEADER_PADDING_PX * minimizeRatio);
  const containerViewport = getContainerViewport(windowViewport, minimizeRatio);
  const cosmonautViewport = getCosmonautViewport(windowViewport, minimizeRatio);
  const bottomOffset = getCosmonautBottomOffset(windowViewport, minimizeRatio);

  return (
    <Container
      minimized={minimizeRatio === 1}
      style={{
        width: containerViewport.width,
        height: containerViewport.height + 2 * headerPadding,
        borderColor: `rgba(8, 8, 9, ${Math.max(0, minimizeRatio - 0.9)})`
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
        {cropRatio < 1 && (
          <FullScreenHeader
            windowViewport={windowViewport}
            cropRatio={cropRatio}
          />
        )}
      </CosmonautContainer>
    </Container>
  );
}

function getMinimizedCosmonautSize(
  windowViewport: Viewport,
  minimizeRatio: number
) {
  const fullSize = getCosmonautSize(windowViewport);
  return Math.round(
    fullSize - (fullSize - MINIMIZED_HEADER_SIZE_PX) * minimizeRatio
  );
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

const Container = styled.div<{ minimized: boolean }>`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background: rgb(255, 255, 255, 0.9);
  border-bottom: 1px solid transparent;
  ${props => props.minimized && `backdrop-filter: saturate(180%) blur(20px);`}
`;

const CosmonautContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`;
