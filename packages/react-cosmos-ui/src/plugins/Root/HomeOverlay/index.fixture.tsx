import React from 'react';
import { OverlayContainer } from '../../../components/ContentOverlay.js';
import { NoFixtureSelected } from './NoFixtureSelected.js';
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
};
