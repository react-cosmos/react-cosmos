import React from 'react';
import { NoFixtureSelected } from './NoFixtureSelected.js';
import { RendererNotResponding } from './RendererNotResponding.js';
import { OverlayContainer } from './shared.js';
import { WelcomeCosmos } from './WelcomeCosmos.js';

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
  ),
};
