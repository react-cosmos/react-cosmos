import React from 'react';
import styled from 'styled-components';
import {
  getMinimizedCosmonautSize,
  MAX_CONTENT_WIDTH_PX,
  MINIMIZED_HEADER_PADDING_PX,
  MINIMIZED_HEADER_SIZE_PX,
  Viewport
} from './shared';

type Props = {
  windowViewport: Viewport;
  minimizeRatio: number;
};

const HEADER_HEIGHT =
  MINIMIZED_HEADER_SIZE_PX + 2 * MINIMIZED_HEADER_PADDING_PX;

export function MinimizedHeader({ windowViewport, minimizeRatio }: Props) {
  const minimizedCosmonautSize = getMinimizedCosmonautSize(
    windowViewport,
    minimizeRatio
  );

  const height =
    minimizedCosmonautSize + 2 * MINIMIZED_HEADER_PADDING_PX * minimizeRatio;
  const marginTop = (windowViewport.height - height) * (1 - minimizeRatio);
  const marginLeft =
    minimizedCosmonautSize +
    2 * MINIMIZED_HEADER_PADDING_PX +
    Math.max(0, windowViewport.width - MAX_CONTENT_WIDTH_PX) / 2;
  const innerScale = height / HEADER_HEIGHT;
  const innerWidth =
    Math.min(MAX_CONTENT_WIDTH_PX, windowViewport.width) -
    MINIMIZED_HEADER_SIZE_PX -
    3 * MINIMIZED_HEADER_PADDING_PX;
  return (
    <Container
      style={{
        height,
        marginTop,
        marginLeft
      }}
    >
      <InnerContainer
        style={{
          width: innerWidth,
          transform: `scale(${innerScale})`,
          opacity: minimizeRatio
        }}
      >
        <h1>React Cosmos</h1>
      </InnerContainer>
    </Container>
  );
}

const Container = styled.div``;

const InnerContainer = styled.div`
  transform-origin: top left;
  position: absolute;
  height: ${HEADER_HEIGHT}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
