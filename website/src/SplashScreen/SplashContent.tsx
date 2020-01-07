import React from 'react';
import styled from 'styled-components';
import { ExternalLink } from '../shared/ExternalLink';
import { getSlideInStyle, slideInTransition } from '../shared/slideIn';
import { getCosmonautSize, Viewport } from '../shared/viewport';

type Props = {
  windowViewport: Viewport;
  gitHubStars: null | number;
};

export function SplashContent({ windowViewport, gitHubStars }: Props) {
  const containerStyle = React.useMemo(
    () => getContainerStyle(windowViewport, gitHubStars),
    [gitHubStars, windowViewport]
  );

  return (
    <Container style={containerStyle}>
      <Title>
        Build UIs at <em>scale</em>.
      </Title>
      <Subtitle>
        Introducing <strong>React Cosmos 5</strong>
        <br />a tool for ambitious UI developers
      </Subtitle>
      <CallToAction href="https://github.com/react-cosmos/react-cosmos">
        <strong>GitHub</strong>
        <Star />
        {gitHubStars}
      </CallToAction>
      <DocsLink href="https://github.com/react-cosmos/react-cosmos/tree/master/docs">
        <span>Docs</span>
        <Chevron />
      </DocsLink>
    </Container>
  );
}

function getContainerStyle(
  windowViewport: Viewport,
  gitHubStars: null | number
) {
  const cosmonautSize = Math.round(getCosmonautSize(windowViewport));
  const fontSize = Math.round(cosmonautSize / 18);
  const slideInStyle = getSlideInStyle(gitHubStars !== null);

  if (isPortrait(windowViewport)) {
    return {
      ...slideInStyle,
      bottom: cosmonautSize,
      left: 0,
      width: windowViewport.width,
      height: windowViewport.height - cosmonautSize,
      fontSize
    };
  }

  return {
    ...slideInStyle,
    bottom: 0,
    left: cosmonautSize,
    width: windowViewport.width - cosmonautSize,
    height: windowViewport.height,
    fontSize
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
  transition: ${slideInTransition};
`;

const Title = styled.h1`
  margin: 0;
  padding: 0;
  background: rgb(9, 53, 86, 0.8);
  font-size: calc(16px + 2.4em);
  font-weight: 600;
  line-height: 1.5em;
  letter-spacing: -0.02em;
  white-space: nowrap;
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 0;
  padding: 0;
  background: rgb(9, 53, 86, 0.8);
  font-size: calc(10px + 1em);
  font-weight: 300;
  line-height: 1.6em;
  color: #b1dcfd;
  white-space: nowrap;
  text-align: center;

  strong {
    font-weight: 600;
  }
`;

const CallToAction = styled(ExternalLink)`
  margin: 2.8em 0 0 0;
  padding: 0 1em;
  background: #b1dcfd;
  color: #0a2e46;
  font-size: calc(10px + 1em);
  font-weight: 400;
  line-height: 2.3em;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none;

  strong {
    font-weight: 500;
  }
`;

const Star = () => {
  return (
    <StyledStar
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </StyledStar>
  );
};

const StyledStar = styled.svg`
  width: 0.8em;
  height: 0.8em;
  stroke-width: calc(2px + 0.005em);
  margin: 0 0.1em 0 0.5em;
  transform: translate(0, 4%);
`;

const DocsLink = styled(ExternalLink)`
  margin: 0.5em 0 0 0;
  padding: 0 1em;
  color: #b1dcfd;
  font-size: calc(10px + 0.8em);
  font-weight: 400;
  line-height: 2.3em;
  text-decoration: none;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Chevron = () => {
  return (
    <StyledChevron
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </StyledChevron>
  );
};

const StyledChevron = styled.svg`
  width: 1em;
  height: 1em;
  stroke-width: calc(2px + 0.005em);
  margin: 0 -0.4em 0 0em;
  transform: translate(0, 9%);
`;
