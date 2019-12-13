import React from 'react';
import styled from 'styled-components';
import {
  headerBackdropFilter,
  headerBg,
  headerBorderBottom
} from '../shared/ui';
import { Cosmonaut } from './Cosmonaut/Cosmonaut';
import { FullScreenHeader } from './FullScreenHeader';
import { HeaderScrollIndicator } from './HeaderScrollIndicator';
import { MinimizedHeader } from './MinimizedHeader';
import {
  COSMONAUT_HPADDING_PX,
  COSMONAUT_SIZE_PX,
  COSMONAUT_VPADDING_PX,
  getCosmonautSize,
  getViewportLength,
  MAX_HEADER_WIDTH_PX,
  Viewport
} from './shared';
import { useGitHubStars } from './useGitHubStars';
import { useHeaderScroll } from './useHeaderScroll';
import { useWindowViewport } from './useWindowViewport';

type HeaderSizes = {
  containerViewport: Viewport;
  cosmonautViewport: Viewport;
  vPadding: number;
  hPadding: number;
  centerPadding: number;
};

export function Header() {
  const windowViewport = useWindowViewport();
  const { cropRatio, minimizeRatio } = useHeaderScroll(windowViewport.height);
  const gitHubStars = useGitHubStars();
  const {
    containerViewport,
    cosmonautViewport,
    vPadding,
    hPadding,
    centerPadding
  } = React.useMemo(() => getHeaderSizes(windowViewport, minimizeRatio), [
    windowViewport,
    minimizeRatio
  ]);
  const minimized = minimizeRatio === 1;

  return (
    <Container
      style={{
        width: containerViewport.width,
        height: containerViewport.height + 2 * vPadding,
        background: minimized ? headerBg : 'transparent',
        borderBottom: minimized ? headerBorderBottom : 'none',
        backdropFilter: minimized ? headerBackdropFilter : 'none'
      }}
    >
      <CosmonautContainer
        key="cosmonaut"
        style={{
          width: cosmonautViewport.width,
          height: cosmonautViewport.height,
          bottom: vPadding,
          left: centerPadding + hPadding
        }}
      >
        <Cosmonaut cropRatio={cropRatio} minimizeRatio={minimizeRatio} />
      </CosmonautContainer>
      {cropRatio < 1 && (
        <>
          <FullScreenHeader
            windowViewport={windowViewport}
            cropRatio={cropRatio}
            gitHubStars={gitHubStars}
          />
          <HeaderScrollIndicator windowViewport={windowViewport} />
        </>
      )}
      {cropRatio === 1 && <MinimizedHeader visible={minimizeRatio === 1} />}
    </Container>
  );
}

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
    vPadding: COSMONAUT_VPADDING_PX * minimizeRatio,
    hPadding: COSMONAUT_HPADDING_PX * minimizeRatio,
    centerPadding:
      (Math.max(0, windowViewport.width - MAX_HEADER_WIDTH_PX) / 2) *
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

function getMinimizedCosmonautSize(
  windowViewport: Viewport,
  minimizeRatio: number
) {
  const fullSize = getCosmonautSize(windowViewport);
  return fullSize - (fullSize - COSMONAUT_SIZE_PX) * minimizeRatio;
}

function getFullScreenCosmonautViewport(windowViewport: Viewport) {
  const width = getViewportLength(windowViewport);
  return { width, height: Math.ceil(getCosmonautSize(windowViewport) * 4) };
}

const Container = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  will-change: height;
`;

const CosmonautContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  will-change: width, height, bottom, left;
`;
