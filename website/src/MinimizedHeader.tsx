import React from 'react';
import styled from 'styled-components';
import {
  getMinimizedCosmonautSize,
  MAX_CONTENT_WIDTH_PX,
  MINIMIZED_HEADER_HPADDING_PX,
  MINIMIZED_HEADER_SIZE_PX,
  MINIMIZED_HEADER_VPADDING_PX,
  Viewport
} from './shared';

type Props = {
  windowViewport: Viewport;
  minimizeRatio: number;
};

const HEADER_HEIGHT =
  MINIMIZED_HEADER_SIZE_PX + 2 * MINIMIZED_HEADER_VPADDING_PX;

export function MinimizedHeader({ windowViewport, minimizeRatio }: Props) {
  const minimizedCosmonautSize = getMinimizedCosmonautSize(
    windowViewport,
    minimizeRatio
  );

  const height =
    minimizedCosmonautSize + 2 * MINIMIZED_HEADER_VPADDING_PX * minimizeRatio;
  const marginTop = (windowViewport.height - height) * (1 - minimizeRatio);
  const marginLeft =
    minimizedCosmonautSize +
    2 * MINIMIZED_HEADER_HPADDING_PX +
    Math.max(0, windowViewport.width - MAX_CONTENT_WIDTH_PX) / 2;
  const innerScale = height / HEADER_HEIGHT;
  const innerWidth =
    Math.min(MAX_CONTENT_WIDTH_PX, windowViewport.width) -
    MINIMIZED_HEADER_SIZE_PX -
    3 * MINIMIZED_HEADER_HPADDING_PX;

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
        <LeftContainer>
          <CosmonautButton onClick={scrollToTop} />
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
        <RightContainer></RightContainer>
      </InnerContainer>
    </Container>
  );
}

function scrollToTop() {
  window.scroll({ top: 0, behavior: 'smooth' });
}

const Container = styled.div``;

const InnerContainer = styled.div`
  transform-origin: top left;
  position: absolute;
  height: ${HEADER_HEIGHT}px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const LeftContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 0 0 8px;
`;

const RightContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CosmonautButton = styled.div`
  position: absolute;
  width: ${MINIMIZED_HEADER_SIZE_PX}px;
  height: ${MINIMIZED_HEADER_SIZE_PX}px;
  top: ${MINIMIZED_HEADER_VPADDING_PX}px;
  left: -${MINIMIZED_HEADER_SIZE_PX + MINIMIZED_HEADER_HPADDING_PX}px;
  background: transparent;
  border-radius: 50%;
  cursor: pointer;
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
