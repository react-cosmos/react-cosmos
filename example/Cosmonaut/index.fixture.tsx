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
  const viewport = useViewport();
  const scrollRatio = useScroll();
  const cropRatio = Math.min(1, scrollRatio * 2);
  const minimizeRatio = Math.max(0, scrollRatio - 0.5) * 2;
  const contentRatio = Math.max(0, minimizeRatio - 0.8) * 20;

  const cosmonautSize = getCosmonautSize(viewport, minimizeRatio);
  const containerSize = getContainerSize(viewport, minimizeRatio);
  const padding = HEADER_PADDING * minimizeRatio;

  return (
    <Bg
      style={{
        paddingTop: SCROLL_SIZE + HEADER_SIZE + 2 * HEADER_PADDING
      }}
    >
      <Container
        style={{
          width: containerSize.width,
          height: containerSize.height + 2 * padding
        }}
      >
        <CosmonautContainer
          style={{
            width: cosmonautSize,
            height: cosmonautSize,
            bottom: padding,
            left: padding
          }}
        >
          <Cosmonaut cropRatio={cropRatio} minimizeRatio={minimizeRatio} />
        </CosmonautContainer>
      </Container>
      <div style={{ opacity: contentRatio }}>
        <p style={{ paddingTop: 128 }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <p key={0}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </p>
        ))}
      </div>
    </Bg>
  );
};

function getContainerSize(viewport: Viewport, minimizeRatio: number) {
  if (minimizeRatio > 0) {
    const cosmonautSize = getCosmonautSize(viewport, minimizeRatio);
    const height =
      viewport.height - (viewport.height - cosmonautSize) * minimizeRatio;
    return { width: viewport.width, height };
  }
  return viewport;
}

function getCosmonautSize(viewport: Viewport, minimizeRatio: number) {
  if (minimizeRatio > 0) {
    const fullSize = Math.max(viewport.width, viewport.height) / 2;
    return HEADER_SIZE + (fullSize - HEADER_SIZE) * (1 - minimizeRatio);
  }
  return Math.max(viewport.width, viewport.height);
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

function useViewport() {
  const [viewport, setViewport] = React.useState(getViewport());
  React.useEffect(() => {
    function handleWindowResize() {
      const newViewport = getViewport();
      if (didViewportChange(viewport, newViewport)) {
        setViewport(newViewport);
      }
    }
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  });
  return viewport;
}

function useScroll() {
  const [scrollRatio, setScrollRatio] = React.useState(0);
  React.useEffect(() => {
    function handleScroll() {
      const yScroll = window.pageYOffset;
      setScrollRatio(Math.min(1, Math.max(0, yScroll / SCROLL_SIZE)));
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return scrollRatio;
}

function getViewport() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

const Bg = styled.div`
  background: #fff;
  padding: 64px;
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  background: rgb(255, 255, 255);
`;

const CosmonautContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`;
