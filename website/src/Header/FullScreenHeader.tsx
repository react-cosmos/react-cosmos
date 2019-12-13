import React from 'react';
import styled from 'styled-components';
import { ExternalLink } from '../shared/ExternalLink';
import { slideInOpacityDuration, slideInYDuration } from '../shared/ui';
import { getCosmonautSize, Viewport } from './shared';

type Props = {
  windowViewport: Viewport;
  cropRatio: number;
  gitHubStars: null | number;
};

type FullScreenHeaderSizes = {
  titleFontSize: number;
  subtitleFontSize: number;
  ctaMarginTop: number;
  ctaHeight: number;
  ctaPadding: number;
  ctaFontSize: number;
  starSize: number;
  starStrokeWidth: number;
  starLeftMargin: number;
  starRightMargin: number;
};

const visibleTextBg = `rgb(9, 53, 86, 0.8)`;

export const FullScreenHeader = React.memo(function FullScreenHeader({
  windowViewport,
  cropRatio,
  gitHubStars
}: Props) {
  const containerStyle = getContainerStyle(windowViewport, cropRatio);
  const {
    titleFontSize,
    subtitleFontSize,
    ctaMarginTop,
    ctaHeight,
    ctaPadding,
    ctaFontSize,
    starSize,
    starStrokeWidth,
    starLeftMargin,
    starRightMargin
  } = getFullScreenHeaderSizes(windowViewport);
  const textBg = cropRatio > 0 ? 'transparent' : visibleTextBg;

  return (
    <Container style={containerStyle}>
      <Title style={{ background: textBg, fontSize: titleFontSize }}>
        Build UIs at <em>scale</em>.
      </Title>
      <Subtitle style={{ background: textBg, fontSize: subtitleFontSize }}>
        Introducing <strong>React Cosmos 5</strong>
        <br />a tool for ambitious UI developers
      </Subtitle>
      <CallToAction
        href="https://github.com/react-cosmos/react-cosmos"
        style={{
          marginTop: ctaMarginTop,
          padding: `0 ${ctaPadding}px`,
          fontSize: ctaFontSize,
          lineHeight: `${ctaHeight}px`,
          opacity: gitHubStars === null ? 0 : 1,
          transform: `scale(${gitHubStars === null ? 0.8 : 1})`
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
  const fontOffset = Math.round(cosmonautSize / 18);
  const titleFontSize = 16 + Math.round(fontOffset * 2.4);
  const subtitleFontSize = 10 + fontOffset;
  const ctaFontSize = 10 + fontOffset;
  const ctaHeight = Math.round(ctaFontSize * 2.3);

  return {
    titleFontSize,
    subtitleFontSize,
    ctaMarginTop: fontOffset * 4,
    ctaPadding: ctaFontSize * 1,
    ctaHeight,
    ctaFontSize,
    starSize: Math.round(subtitleFontSize * 0.75),
    starStrokeWidth: Math.max(2, Math.ceil(subtitleFontSize / 30)),
    starLeftMargin: Math.round(subtitleFontSize / 2),
    starRightMargin: Math.round(subtitleFontSize / 10)
  };
}

function getContainerStyle(windowViewport: Viewport, cropRatio: number) {
  const cosmonautSize = Math.round(getCosmonautSize(windowViewport));
  const opacity = cropRatio > 0.2 ? 0 : 1;

  if (isPortrait(windowViewport)) {
    return {
      opacity,
      bottom: cosmonautSize,
      left: 0,
      width: windowViewport.width,
      height: windowViewport.height - cosmonautSize
    };
  }

  return {
    opacity,
    bottom: 0,
    left: cosmonautSize,
    width: windowViewport.width - cosmonautSize,
    height: windowViewport.height
  };
}

function isPortrait(viewport: Viewport) {
  return viewport.height > viewport.width;
}

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  transition: opacity 0.4s;
`;

const Title = styled.h1`
  margin: 0;
  padding: 0;
  font-weight: 600;
  line-height: 1.5em;
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

const CallToAction = styled(ExternalLink)`
  background: #b1dcfd;
  color: #0a2e46;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;
  transition: ${slideInOpacityDuration}s opacity, ${slideInYDuration}s transform;

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
      style={{
        margin: `0 ${rightMargin}px 0 ${leftMargin}px`
      }}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </StyledStar>
  );
};

const StyledStar = styled.svg`
  transform: translate(0, 3%);
`;
