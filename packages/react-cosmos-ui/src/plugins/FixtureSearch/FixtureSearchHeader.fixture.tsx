import React from 'react';
import { FixtureSearchHeader } from './FixtureSearchHeader.js';

export default (
  <FixtureSearchHeader
    fixtureSelected={true}
    onOpen={() => console.log('Open fixture search overlay')}
    onCloseNavPanel={() => console.log('Close nav panel')}
  />
);
