import React from 'react';
import { NoFixtureSelected } from './NoFixtureSelected';
import { RendererNotResponding } from './RendererNotResponding';
import { OverlayContainer } from './shared';
import { WelcomeCosmos } from './WelcomeCosmos';

export default {
  welcome: (
    <OverlayContainer>
      <WelcomeCosmos onDismissWelcome={() => console.log('dismiss welcome')} />
    </OverlayContainer>
  ),

  'no fixture selected': (
    <OverlayContainer>
      <NoFixtureSelected onShowWelcome={() => console.log('show welcome')} />
    </OverlayContainer>
  ),

  'renderer not responding': (
    <OverlayContainer>
      <RendererNotResponding />
    </OverlayContainer>
  )
};
