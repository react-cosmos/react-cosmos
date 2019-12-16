import React from 'react';
import styled from 'styled-components';
import { FullScreenCosmonaut } from '../Cosmonaut/FullScreenCosmonaut';
import { SplashContent } from './SplashContent';
import { ScrollIndicator } from './ScrollIndicator';
import { getCosmonautSize, getViewportLength, Viewport } from './shared';
import { useGitHubStars } from './useGitHubStars';
import { useWindowViewport } from './useWindowViewport';

export function SplashScreen() {
  const gitHubStars = useGitHubStars();
  const windowViewport = useWindowViewport();
  const cosmonautViewport = getFullScreenCosmonautViewport(windowViewport);

  return (
    <Container
      id="splash-screen"
      style={{ width: windowViewport.width, height: windowViewport.height }}
    >
      <CosmonautContainer>
        <FullScreenCosmonaut
          width={cosmonautViewport.width}
          height={cosmonautViewport.height}
        />
      </CosmonautContainer>
      <SplashContent
        windowViewport={windowViewport}
        gitHubStars={gitHubStars}
      />
      <ScrollIndicator windowViewport={windowViewport} />
    </Container>
  );
}

function getFullScreenCosmonautViewport(windowViewport: Viewport) {
  const width = getViewportLength(windowViewport);
  return { width, height: Math.ceil(getCosmonautSize(windowViewport) * 4) };
}

const Container = styled.div`
  position: relative;
  overflow: hidden;
`;

const CosmonautContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`;
