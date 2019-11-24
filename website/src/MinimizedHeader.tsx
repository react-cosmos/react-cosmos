import React from 'react';
import styled from 'styled-components';
import {
  getMinimizedCosmonautSize,
  MAX_CONTENT_WIDTH_PX,
  HEADER_HPADDING_PX,
  COSMONAUT_SIZE_PX,
  HEADER_VPADDING_PX,
  Viewport
} from './shared';

type Props = {
  windowViewport: Viewport;
  minimizeRatio: number;
};

type MinimizedHeaderSizes = {
  minimizeScale: number;
  height: number;
  marginTop: number;
  marginLeft: number;
  innerWidth: number;
};

const MINIMIZED_HEADER_HEIGHT_PX = COSMONAUT_SIZE_PX + 2 * HEADER_VPADDING_PX;

export function MinimizedHeader({ windowViewport, minimizeRatio }: Props) {
  const {
    minimizeScale,
    height,
    marginTop,
    marginLeft,
    innerWidth
  } = getMinimizeHeaderSizes(windowViewport, minimizeRatio);

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
          transform: `scale(${minimizeScale})`,
          opacity: minimizeRatio
        }}
      >
        <CosmonautButton onClick={scrollToTop} />
        <LeftContainer>
          <Title>
            <a
              href="/"
              onClick={e => {
                e.preventDefault();
                scrollToTop();
              }}
            >
              React
              <br />
              Cosmos
            </a>
          </Title>
          <Links>
            <Link
              href="https://github.com/react-cosmos/react-cosmos"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </Link>
            <Separator>/</Separator>
            <Link
              href="https://join-react-cosmos.now.sh/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Slack
            </Link>
            <Separator>/</Separator>
            <Link
              href="https://twitter.com/ReactCosmos"
              rel="noopener noreferrer"
              target="_blank"
            >
              Twitter
            </Link>
          </Links>
        </LeftContainer>
      </InnerContainer>
    </Container>
  );
}

function getMinimizeHeaderSizes(
  windowViewport: Viewport,
  minimizeRatio: number
): MinimizedHeaderSizes {
  const minimizedCosmonautSize = getMinimizedCosmonautSize(
    windowViewport,
    minimizeRatio
  );
  const reverseMinimizeRatio = 1 - minimizeRatio;
  const minimizeScale = minimizedCosmonautSize / COSMONAUT_SIZE_PX;
  const height = MINIMIZED_HEADER_HEIGHT_PX * minimizeScale;
  const outerWidth = Math.max(0, windowViewport.width - MAX_CONTENT_WIDTH_PX);
  const remainingHeight = windowViewport.height - height;
  const hPadding = HEADER_HPADDING_PX * minimizeScale;

  return {
    minimizeScale,
    height,
    marginTop:
      (remainingHeight + HEADER_VPADDING_PX * minimizeScale) *
      reverseMinimizeRatio,
    marginLeft:
      (outerWidth / 2) * minimizeRatio - hPadding * reverseMinimizeRatio,
    innerWidth: Math.min(MAX_CONTENT_WIDTH_PX, windowViewport.width)
  };
}

function scrollToTop() {
  window.scroll({ top: 0, behavior: 'smooth' });
}

const Container = styled.div``;

const InnerContainer = styled.div`
  transform-origin: top left;
  position: absolute;
  height: ${MINIMIZED_HEADER_HEIGHT_PX}px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`;

const CosmonautButton = styled.div`
  flex-shrink: 0;
  width: ${COSMONAUT_SIZE_PX}px;
  height: ${COSMONAUT_SIZE_PX}px;
  margin: 0 0 ${HEADER_VPADDING_PX}px ${HEADER_HPADDING_PX}px;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 0 0 12px;
`;

const Title = styled.h1`
  font-size: 32px;
  letter-spacing: -0.03em;
  line-height: 30px;
  margin: 0;
  padding: 0;

  a {
    color: inherit;
    text-decoration: none;
  }
`;

const Links = styled.div`
  display: flex;
  flex-direction: row;
  line-height: 16px;
  font-size: 16px;
  font-weight: 300;
  margin: 0 0 0 2px;
  padding: 12px 0;

  strong {
    font-weight: 500;
  }
`;

const Link = styled.a`
  color: inherit;
  font-weight: 500;
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`;

const Separator = styled.div`
  margin: 0 8px;
  opacity: 0.5;
`;
