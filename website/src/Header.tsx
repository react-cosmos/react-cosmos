import React from 'react';
import styled from 'styled-components';
import { Cosmonaut } from './Cosmonaut/Cosmonaut';
import { FullScreenHeader } from './FullScreenHeader';
import { MinimizedHeader } from './MinimizedHeader';
import {
  getCosmonautSize,
  getMinimizedCosmonautSize,
  getViewportLength,
  MAX_CONTENT_WIDTH_PX,
  MINIMIZED_HEADER_HPADDING_PX,
  Viewport,
  MINIMIZED_HEADER_VPADDING_PX
} from './shared';

type Props = {
  windowViewport: Viewport;
  cropRatio: number;
  minimizeRatio: number;
};

export const Header = React.memo(function Header({
  windowViewport,
  cropRatio,
  minimizeRatio
}: Props) {
  const containerViewport = getContainerViewport(windowViewport, minimizeRatio);
  const cosmonautViewport = getCosmonautViewport(windowViewport, minimizeRatio);
  const bottomOffset = getCosmonautBottomOffset(windowViewport, minimizeRatio);
  const vPadding = Math.round(MINIMIZED_HEADER_VPADDING_PX * minimizeRatio);
  const hPadding = Math.round(MINIMIZED_HEADER_HPADDING_PX * minimizeRatio);
  const centerPadding =
    (Math.max(0, windowViewport.width - MAX_CONTENT_WIDTH_PX) / 2) *
    minimizeRatio;

  return (
    <Container
      minimized={minimizeRatio === 1}
      style={{
        width: containerViewport.width,
        height: containerViewport.height + 2 * vPadding,
        borderColor: `rgba(9,53,86, ${Math.max(0, minimizeRatio - 0.8)})`
      }}
    >
      <CosmonautContainer
        style={{
          width: cosmonautViewport.width,
          height: cosmonautViewport.height,
          bottom: bottomOffset + vPadding,
          left: hPadding + centerPadding
        }}
      >
        <Cosmonaut cropRatio={cropRatio} minimizeRatio={minimizeRatio} />
      </CosmonautContainer>
      {cropRatio < 1 && (
        <FullScreenHeader
          windowViewport={windowViewport}
          cropRatio={cropRatio}
        />
      )}
      {cropRatio === 1 && (
        <MinimizedHeader
          windowViewport={windowViewport}
          minimizeRatio={minimizeRatio}
        />
      )}
    </Container>
  );
});

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
