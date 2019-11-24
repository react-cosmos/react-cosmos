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
  HEADER_HPADDING_PX,
  HEADER_VPADDING_PX,
  Viewport
} from './shared';
import { useGitHubStars } from './useGitHubStars';

type Props = {
  windowViewport: Viewport;
  cropRatio: number;
  minimizeRatio: number;
};

type HeaderSizes = {
  containerViewport: Viewport;
  cosmonautViewport: Viewport;
  bottomOffset: number;
  vPadding: number;
  hPadding: number;
  centerPadding: number;
};

export const Header = React.memo(function Header({
  windowViewport,
  cropRatio,
  minimizeRatio
}: Props) {
  const gitHubStars = useGitHubStars();
  const {
    containerViewport,
    cosmonautViewport,
    bottomOffset,
    vPadding,
    hPadding,
    centerPadding
  } = React.useMemo(() => getHeaderSizes(windowViewport, minimizeRatio), [
    windowViewport,
    minimizeRatio
  ]);

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
          left: centerPadding + hPadding
        }}
      >
        <Cosmonaut cropRatio={cropRatio} minimizeRatio={minimizeRatio} />
      </CosmonautContainer>
      {cropRatio < 1 && (
        <FullScreenHeader
          windowViewport={windowViewport}
          cropRatio={cropRatio}
          gitHubStars={gitHubStars}
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

function getHeaderSizes(
  windowViewport: Viewport,
  minimizeRatio: number
): HeaderSizes {
  return {
    containerViewport:
      minimizeRatio > 0
        ? getMinimizedContainerViewport(windowViewport, minimizeRatio)
        : windowViewport,
    cosmonautViewport:
      minimizeRatio > 0
        ? getMinimizedCosmonautViewport(windowViewport, minimizeRatio)
        : getFullScreenCosmonautViewport(windowViewport),
    bottomOffset:
      minimizeRatio > 0
        ? 0
        : getFullScreenCosmonautBottomOffset(windowViewport),
    vPadding: HEADER_VPADDING_PX * minimizeRatio,
    hPadding: HEADER_HPADDING_PX * minimizeRatio,
    centerPadding:
      (Math.max(0, windowViewport.width - MAX_CONTENT_WIDTH_PX) / 2) *
      minimizeRatio
  };
}

function getMinimizedContainerViewport(
  windowViewport: Viewport,
  minimizeRatio: number
) {
  const cosmonautSize = getMinimizedCosmonautSize(
    windowViewport,
    minimizeRatio
  );
  const height =
    windowViewport.height -
    (windowViewport.height - cosmonautSize) * minimizeRatio;
  return { width: windowViewport.width, height };
}

function getMinimizedCosmonautViewport(
  windowViewport: Viewport,
  minimizeRatio: number
) {
  const cosmonautSize = getMinimizedCosmonautSize(
    windowViewport,
    minimizeRatio
  );
  return { width: cosmonautSize, height: cosmonautSize };
}

function getFullScreenCosmonautViewport(windowViewport: Viewport) {
  const width = getViewportLength(windowViewport);
  return { width, height: Math.ceil(getCosmonautSize(windowViewport) * 4) };
}

function getFullScreenCosmonautBottomOffset(windowViewport: Viewport) {
  return -Math.floor(getCosmonautSize(windowViewport));
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
