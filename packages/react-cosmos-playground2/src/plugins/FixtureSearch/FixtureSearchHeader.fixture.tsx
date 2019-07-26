import React from 'react';
import { FixtureSearchHeader } from './FixtureSearchHeader';

export default (
  <FixtureSearchHeader
    onOpen={() => console.log('Open fixture search overlay')}
    onMinimizeNav={() => console.log('Minimize nav')}
  />
);
