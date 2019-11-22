import React from 'react';
import styled from 'styled-components';
import {
  getMinimizedCosmonautSize,
  MINIMIZED_HEADER_PADDING_PX,
  Viewport
} from './shared';

type Props = {
  windowViewport: Viewport;
  minimizeRatio: number;
};

export function MinimizedHeader({ windowViewport, minimizeRatio }: Props) {
  const minimizedCosmonautSize = getMinimizedCosmonautSize(
    windowViewport,
    minimizeRatio
  );

  const height =
    minimizedCosmonautSize + 2 * MINIMIZED_HEADER_PADDING_PX * minimizeRatio;
  const marginTop = (windowViewport.height - height) * (1 - minimizeRatio);
  const marginLeft = minimizedCosmonautSize + 2 * MINIMIZED_HEADER_PADDING_PX;
  return (
    <Container
      style={{
        height,
        marginTop,
        marginLeft
      }}
    />
  );
}

const Container = styled.div`
  margin: 0 ${MINIMIZED_HEADER_PADDING_PX}px 0 0;
  background: rgb(0, 0, 255, 0.5);
`;
