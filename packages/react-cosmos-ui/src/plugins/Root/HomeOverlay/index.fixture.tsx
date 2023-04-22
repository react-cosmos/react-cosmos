import React from 'react';
import { NoFixtureSelected } from './NoFixtureSelected.js';
import { WelcomeCosmos } from './WelcomeCosmos.js';

export default {
  welcome: (
    <WelcomeCosmos onDismissWelcome={() => console.log('dismiss welcome')} />
  ),

  'no fixture selected': (
    <NoFixtureSelected onShowWelcome={() => console.log('show welcome')} />
  ),
};
