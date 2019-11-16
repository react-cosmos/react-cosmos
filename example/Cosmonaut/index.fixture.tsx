import React from 'react';
import styled from 'styled-components';
import { Cosmonaut } from './Cosmonaut';
import { useValue } from 'react-cosmos/fixture';

const LOGO_SIZE = 100;
const LOGO_PADDING = 16;

type Viewport = {
  width: number;
  height: number;
};

export default () => {
  const viewport = useViewport();
  const [slider, setSlider] = useValue('ratio', { defaultValue: 0 });

  const ratio = slider / 1000;
  const cropRatio = Math.min(1, ratio * 2);
  const minimizeRatio = Math.max(0, ratio - 0.5) * 2;

  const cosmonautSize = getCosmonautSize(viewport, minimizeRatio);
  const containerSize = getContainerSize(viewport, minimizeRatio);
  const padding = LOGO_PADDING * minimizeRatio;

  return (
    <Bg>
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
      <Slider value={slider} onChange={e => setSlider(+e.target.value)} />
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
    return LOGO_SIZE + (fullSize - LOGO_SIZE) * (1 - minimizeRatio);
  }

  return Math.max(viewport.width, viewport.height);
}

function useViewport() {
  const [viewport, setViewport] = React.useState(getViewport());
  React.useEffect(() => {
    function handleWindowResize() {
      setViewport(getViewport());
    }
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  });
  return viewport;
}

function getViewport() {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

const Bg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
`;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
`;

const CosmonautContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`;

const Slider = styled.input.attrs({ type: 'range', min: 0, max: 1000 })`
  position: absolute;
  bottom: 6px;
  left: 6px;
  width: calc(100% - 12px);
  margin: 0;
`;
