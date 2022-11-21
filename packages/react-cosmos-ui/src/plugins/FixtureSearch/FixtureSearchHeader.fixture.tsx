import React from 'react';
import { FixtureSearchHeader } from './FixtureSearchHeader.js';

export default (
  <FixtureSearchHeader
    validFixtureSelected={true}
    onOpen={() => console.log('Open fixture search overlay')}
    onCloseNav={() => console.log('Close nav')}
  />
);
