import React from 'react';
import styled from 'styled-components';
import { getSkyMaskRadius } from './Cosmonaut/Cosmonaut';
import { getCosmonautSize, Viewport } from './shared';

type Props = {
  windowViewport: Viewport;
  cropRatio: number;
};

export function FullScreenHeader({ windowViewport, cropRatio }: Props) {
  const containerStyle = getContainerStyle(windowViewport);
  const clipPath = getClipPath(windowViewport, cropRatio);

  return (
    <Container clipPath={clipPath} style={containerStyle}>
      <h1>React Cosmos</h1>
    </Container>
  );
}

function getContainerStyle(windowViewport: Viewport) {
  const cosmonautSize = Math.round(getCosmonautSize(windowViewport));

  if (isPortrait(windowViewport)) {
    return {
      bottom: cosmonautSize,
      left: 0,
      width: windowViewport.width,
      height: windowViewport.height - cosmonautSize
    };
  }

  return {
    bottom: 0,
    left: cosmonautSize,
    width: windowViewport.width - cosmonautSize,
    height: windowViewport.height
  };
}

function getClipPath(windowViewport: Viewport, cropRatio: number) {
  const cosmonautSize = getCosmonautSize(windowViewport);
  const clipX = isPortrait(windowViewport)
    ? cosmonautSize / 2
    : -cosmonautSize / 2;
  const clipY = windowViewport.height - cosmonautSize + cosmonautSize / 2;
  const clipRadius = getSkyMaskRadius(cropRatio) * (cosmonautSize / 256);
  return `circle(${clipRadius}px at ${clipX}px ${clipY}px)`;
}

function isPortrait(viewport: Viewport) {
  return viewport.height > viewport.width;
}

const Container = styled.div<{ clipPath: string }>`
  position: absolute;
  clip-path: ${props => props.clipPath};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
