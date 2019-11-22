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

  if (windowViewport.height > windowViewport.width) {
    const clipPath = getClipPath(windowViewport, cropRatio, true);
    return (
      <Container
        style={{
          bottom: cosmonautSize * 2,
          left: 0,
          width: windowViewport.width,
          height: windowViewport.height - cosmonautSize,
          clipPath
        }}
      />
    );
  }

  const clipPath = getClipPath(windowViewport, cropRatio, false);
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

function getClipPath(
  windowViewport: Viewport,
  cropRatio: number,
  portrait: boolean
) {
  const cosmonautSize = getCosmonautSize(windowViewport);
  const clipX = portrait ? cosmonautSize / 2 : -cosmonautSize / 2;
  const clipY = windowViewport.height - cosmonautSize + cosmonautSize / 2;
  const clipRadius = getSkyMaskRadius(cropRatio) * (cosmonautSize / 256);
  return `circle(${clipRadius}px at ${clipX}px ${clipY}px)`;
}

const Container = styled.div`
  position: absolute;
  background: rgb(255, 0, 0, 0.5);
`;
