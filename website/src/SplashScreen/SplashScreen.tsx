import React from 'react';
import styled from 'styled-components';
import { FullScreenCosmonaut } from '../Cosmonaut/FullScreenCosmonaut';
import { useWindowViewport } from '../shared/useWindowViewport';
import { ScrollIndicator } from './ScrollIndicator';
import { SplashContent } from './SplashContent';
import { useGitHubStars } from './useGitHubStars';

export function SplashScreen() {
  const gitHubStars = useGitHubStars();
  const windowViewport = useWindowViewport();
  const { width, height } = windowViewport;

  return (
    <Container id="splash-screen" style={{ width, height }}>
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
