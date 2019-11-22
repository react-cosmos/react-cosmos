import React from 'react';
import styled from 'styled-components';
import { getSkyMaskRadius } from './Cosmonaut/Cosmonaut';
import { getCosmonautSize, Viewport } from './shared';

type Props = {
  windowViewport: Viewport;
  cropRatio: number;
};

export function FullScreenHeader({ windowViewport, cropRatio }: Props) {
  const cosmonautSize = Math.round(getCosmonautSize(windowViewport));
  const clipPath = getClipPath(windowViewport, cropRatio);

  return (
    <Container
      style={{
        bottom: cosmonautSize,
        left: cosmonautSize,
        width: windowViewport.width - cosmonautSize,
        height: windowViewport.height,
        clipPath
      }}
    />
  );
}

function getClipPath(windowViewport: Viewport, cropRatio: number) {
  const cosmonautSize = getCosmonautSize(windowViewport);
  const clipX = -cosmonautSize / 2;
  const clipY = windowViewport.height - cosmonautSize + cosmonautSize / 2;
  const clipRadius = getSkyMaskRadius(cropRatio) * (cosmonautSize / 256);
  return `circle(${clipRadius}px at ${clipX}px ${clipY}px)`;
}

const Container = styled.div`
  position: absolute;
  background: rgb(255, 0, 0, 0.5);
`;
