import React from 'react';
import styled from 'styled-components';
import { Cosmonaut } from './Cosmonaut';

const HEADER_SIZE = 128;
const HEADER_PADDING = 16;
const SCROLL_SIZE = 500;

type Viewport = {
  width: number;
  height: number;
};

export default () => {
  const windowViewport = useWindowViewport();
  const scrollRatio = useWindowScroll();
  const cropRatio = Math.min(1, scrollRatio * 2);
  const minimizeRatio = Math.max(0, scrollRatio - 0.5) * 2;
  const showContent = minimizeRatio >= 1;

  const headerPadding = Math.round(HEADER_PADDING * minimizeRatio);
  const containerViewport = getContainerViewport(windowViewport, minimizeRatio);
  const cosmonautViewport = getCosmonautViewport(windowViewport, minimizeRatio);
  const bottomOffset = getCosmonautBottomOffset(windowViewport, minimizeRatio);

  return (
    <Bg
      style={{
        paddingTop: SCROLL_SIZE + HEADER_SIZE + 2 * HEADER_PADDING,
        background: cropRatio > 0.5 ? '#fff' : '#093556'
      }}
    >
      <HeaderContainer
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
      </HeaderContainer>
      <div style={{ opacity: showContent ? 1 : 0, transition: '0.4s opacity' }}>
        <p style={{ paddingTop: 128 }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry&apos;s standard dummy text
          ever since the 1500s, when an unknown printer took a galley of type
          and scrambled it to make a type specimen book. It has survived not
          only five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(i => (
          <p key={i}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry&apos;s standard dummy
            text ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has survived
            not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged. It was popularised in
            the 1960s with the release of Letraset sheets containing Lorem Ipsum
            passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is
            simply dummy text of the printing and typesetting industry. Lorem
            Ipsum has been the industry&apos;s standard dummy text ever since
            the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book. It has survived not only
            five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply
            dummy text of the printing and typesetting industry. Lorem Ipsum has
            been the industry&apos;s standard dummy text ever since the 1500s,
            when an unknown printer took a galley of type and scrambled it to
            make a type specimen book. It has survived not only five centuries,
            but also the leap into electronic typesetting, remaining essentially
            unchanged. It was popularised in the 1960s with the release of
            Letraset sheets containing Lorem Ipsum passages, and more recently
            with desktop publishing software like Aldus PageMaker including
            versions of Lorem Ipsum.
          </p>
        ))}
      </div>
    </Bg>
  );
};

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

function useWindowViewport() {
  const [viewport, setViewport] = React.useState(getWindowViewport());
  React.useEffect(() => {
    function handleWindowResize() {
      const newViewport = getWindowViewport();
      if (didViewportChange(viewport, newViewport)) {
        setViewport(newViewport);
      }
    }
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  });
  return viewport;
}

function getWindowViewport() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

function didViewportChange(oldViewport: Viewport, newViewport: Viewport) {
  if (newViewport.width !== oldViewport.width) {
    return true;
  }
  // Ignore small height changes that occur on scroll in landscape mode.
  // Eg. Safari on iOS minimizes the address bar and hides the bottom menu
  // after initial scroll
  const heightDiff = Math.abs(newViewport.height - oldViewport.height);
  return heightDiff / newViewport.height >= 0.2;
}

function useWindowScroll() {
  const [yScroll, setYScroll] = React.useState(window.pageYOffset);
  React.useEffect(() => {
    function handleScroll() {
      const { pageYOffset } = window;
      if (
        getScrollRatio(yScroll) >= 1 ||
        Math.abs(pageYOffset - yScroll) >= 2
      ) {
        setYScroll(pageYOffset);
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });
  return getScrollRatio(yScroll);
}

function getScrollRatio(yScroll: number) {
  return Math.min(1, Math.max(0, yScroll / SCROLL_SIZE));
}

const Bg = styled.div`
  padding: 64px;
`;

const HeaderContainer = styled.div`
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
