import React from 'react';
import styled from 'styled-components';
import { FullScreenCosmonaut } from '../Cosmonaut/FullScreenCosmonaut.js';
import { useWindowViewport } from '../shared/useWindowViewport.js';
import { ScrollIndicator } from './ScrollIndicator.js';
import { SplashContent } from './SplashContent.js';
import { useGitHubStars } from './useGitHubStars.js';

export function SplashScreen() {
  const gitHubStars = useGitHubStars();
  const windowViewport = useWindowViewport();
  const { height } = windowViewport;

  return (
    <Container id="splash-screen" style={{ height }}>
      <CosmonautContainer>
        <FullScreenCosmonaut windowViewport={windowViewport} />
      </CosmonautContainer>
      <SplashContent
        windowViewport={windowViewport}
        gitHubStars={gitHubStars}
      />
      <ScrollIndicator windowViewport={windowViewport} />
    </Container>
  );
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
