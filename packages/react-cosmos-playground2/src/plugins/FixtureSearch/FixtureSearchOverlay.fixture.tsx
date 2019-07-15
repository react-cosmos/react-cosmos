import React from 'react';
import { FixtureSearchOverlay } from './FixtureSearchOverlay';

const fixtures = {
  'src/__fixtures__/styleguide/button.tsx': null,
  'src/__fixtures__/styleguide/colorPalette.tsx': null,
  'src/plugins/ClassStatePanel/ClassStatePanel/index.fixture.tsx': null,
  'src/plugins/ContentOverlay/index.fixture.tsx': [
    'waiting',
    'not found',
    'welcome',
    'renderer not responding'
  ],
  'src/plugins/FixtureSearch/FixtureSearchOverlay.fixture.tsx': null,
  'src/plugins/FixtureTree/BlankState.fixture.tsx': null,
  'src/plugins/Notifications/index.fixture.tsx': ['single', 'multiple'],
  'src/plugins/PropsPanel/BlankState.fixture.tsx': null,
  'src/plugins/PropsPanel/PropsPanel/index.fixture.tsx': null,
  'src/plugins/slots.fixture.tsx': ['root', 'nav', 'rendererHeader'],
  'src/shared/ui/buttons/index.fixture.tsx': null,
  'src/shared/ui/valueInputTree/index.fixture.tsx': null
};

export default (
  <FixtureSearchOverlay
    fixturesDir="__fixtures__"
    fixtureFileSuffix="fixture"
    fixtures={fixtures}
    onClose={() => console.log('Close fixture overlay')}
    onSelect={fixtureId => console.log('Select fixture', fixtureId)}
  />
);
