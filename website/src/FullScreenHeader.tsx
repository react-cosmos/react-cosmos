import React from 'react';
import styled from 'styled-components';
import { getSkyMaskRadius } from './Cosmonaut/Cosmonaut';
import { getCosmonautSize, Viewport } from './shared';

type Props = {
  windowViewport: Viewport;
  cropRatio: number;
  gitHubStars: number;
};

type FullScreenHeaderSizes = {
  titleFontSize: number;
  subtitleFontSize: number;
  ctaMarginTop: number;
  ctaPaddingTop: number;
  ctaPaddingBottom: number;
  ctaFontSize: number;
  starSize: number;
  starStrokeWidth: number;
  starLeftMargin: number;
  starRightMargin: number;
};

export const FullScreenHeader = React.memo(function FullScreenHeader({
  windowViewport,
  cropRatio,
  gitHubStars
}: Props) {
  const containerStyle = getContainerStyle(windowViewport);
  const clipPath = getClipPath(windowViewport, cropRatio);
  const {
    titleFontSize,
    subtitleFontSize,
    ctaMarginTop,
    ctaPaddingTop,
    ctaPaddingBottom,
    ctaFontSize,
    starSize,
    starStrokeWidth,
    starLeftMargin,
    starRightMargin
  } = React.useMemo(() => getFullScreenHeaderSizes(windowViewport), [
    windowViewport
  ]);

  return (
    <Container clipPath={clipPath} style={containerStyle}>
      <Title style={{ fontSize: titleFontSize }}>
        Build UIs at <em>scale</em>.
      </Title>
      <Subtitle style={{ fontSize: subtitleFontSize }}>
        Introducing <strong>React Cosmos 5</strong>
        <br />a tool for ambitious UI developers
      </Subtitle>
      <CallToAction
        href="https://github.com/react-cosmos/react-cosmos"
        rel="noopener noreferrer"
        target="_blank"
        style={{
          marginTop: ctaMarginTop,
          padding: `${ctaPaddingTop}px ${ctaPaddingBottom}px`,
          fontSize: ctaFontSize
        }}
      >
        <strong>GitHub</strong>
        <Star
          size={starSize}
          strokeWidth={starStrokeWidth}
          leftMargin={starLeftMargin}
          rightMargin={starRightMargin}
        />
        {gitHubStars}
      </CallToAction>
    </Container>
  );
});

function getFullScreenHeaderSizes(
  windowViewport: Viewport
): FullScreenHeaderSizes {
  const cosmonautSize = getCosmonautSize(windowViewport);
  const fontOffset = roundEven(cosmonautSize / 18);
  const titleFontSize = 16 + fontOffset * 2;
  const subtitleFontSize = 8 + fontOffset;
  const ctaFontSize = roundEven(subtitleFontSize * 0.9);

  return {
    titleFontSize,
    subtitleFontSize,
    ctaMarginTop: fontOffset * 3,
    ctaPaddingTop: fontOffset * 0.8,
    ctaPaddingBottom: fontOffset * 1.2,
    ctaFontSize,
    starSize: Math.round(subtitleFontSize * 0.75),
    starStrokeWidth: Math.max(2, Math.ceil(subtitleFontSize / 30)),
    starLeftMargin: Math.round(subtitleFontSize / 2),
    starRightMargin: Math.round(subtitleFontSize / 10)
  };
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

function roundEven(nr: number) {
  return Math.round(nr / 2) * 2;
}

const Container = styled.div<{ clipPath: string }>`
  position: absolute;
  clip-path: ${props => props.clipPath};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
`;

const Title = styled.h1`
  margin: 0;
  padding: 0;
  font-weight: 600;
  line-height: 2em;
  letter-spacing: -0.02em;
  white-space: nowrap;
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 0;
  padding: 0;
  font-weight: 300;
  line-height: 1.6em;
  color: #b1dcfd;
  white-space: nowrap;
  text-align: center;
`;

const CallToAction = styled.a`
  background: #b1dcfd;
  color: #0a2e46;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;

  strong {
    font-weight: 500;
  }
`;

type StarProps = {
  size: number;
  strokeWidth: number;
  leftMargin: number;
  rightMargin: number;
};

const Star = ({ size, strokeWidth, leftMargin, rightMargin }: StarProps) => {
  return (
    <StyledStar
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      leftMargin={leftMargin}
      rightMargin={rightMargin}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </StyledStar>
  );
};

const StyledStar = styled.svg<{ leftMargin: number; rightMargin: number }>`
  margin: 0 ${props => props.rightMargin}px 0 ${props => props.leftMargin}px;
  transform: translate(0, 3%);
`;
