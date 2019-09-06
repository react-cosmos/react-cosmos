import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import { useValue } from 'react-cosmos/fixture';
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

export default {
  'no fixure selected': createFixtureSearchOverlay(),

  'fixture selected': createFixtureSearchOverlay({
    path: 'src/plugins/Notifications/index.fixture.tsx',
    name: 'multiple'
  })
};

function createFixtureSearchOverlay(fixtureId: null | FixtureId = null) {
  return () => {
    const [searchText, setSearchText] = useValue('searchText', {
      defaultValue: ''
    });
    return (
      <FixtureSearchOverlay
        searchText={searchText}
        fixturesDir="__fixtures__"
        fixtureFileSuffix="fixture"
        fixtures={fixtures}
        selectedFixtureId={fixtureId}
        onSetSearchText={setSearchText}
        onClose={() => console.log('Close fixture search overlay')}
        onSelect={selectedFixtureId =>
          console.log('Select fixture', selectedFixtureId)
        }
      />
    );
  };
}
