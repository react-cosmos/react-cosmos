import React from 'react';
import styled from 'styled-components';
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
  bottomOffset: number;
  vPadding: number;
  hPadding: number;
  centerPadding: number;
};

export function Header() {
  const windowViewport = useWindowViewport();
  const { cropRatio, minimizeRatio } = useHeaderScroll(windowViewport.height);
  useBodyBg(cropRatio);
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
        height: containerViewport.height + 2 * vPadding
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

function useBodyBg(cropRatio: number) {
  const bodyBg = cropRatio > 0.1 ? 'linear-gradient(#d6dde2, #fff)' : '#093556';
  React.useEffect(() => {
    const element = document.getElementById('gradient1');
    if (element) element.style.background = bodyBg;
  }, [bodyBg]);
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
    bottomOffset:
      minimizeRatio > 0
        ? 0
        : getFullScreenCosmonautBottomOffset(windowViewport),
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

function getFullScreenCosmonautBottomOffset(windowViewport: Viewport) {
  return -Math.floor(getCosmonautSize(windowViewport));
}

const Container = styled.div<{ minimized: boolean }>`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background: rgb(255, 255, 255, ${props => (props.minimized ? 0.9 : 0)});
  border-bottom: 1px solid
    rgba(10, 46, 70, ${props => (props.minimized ? 0.24 : 0)});
  backdrop-filter: ${props =>
    props.minimized ? 'saturate(180%) blur(15px)' : 'none'};
  will-change: height;
`;

const CosmonautContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  will-change: width, height, bottom, left;
`;
