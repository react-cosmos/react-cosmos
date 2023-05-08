import React from 'react';
import { FixtureId } from 'react-cosmos-core';
import { useValue } from 'react-cosmos/client';
import { fixtures } from '../../testHelpers/dataMocks.js';
import { FixtureSearchOverlay } from './FixtureSearchOverlay.js';

export default {
  'no fixture selected': createFixture(),

  'fixture selected': createFixture({
    path: 'src/plugins/Notifications/index.fixture.tsx',
    name: 'multiple',
  }),
};

function createFixture(fixtureId: null | FixtureId = null) {
  return () => {
    const [searchText, setSearchText] = useValue<string>('searchText', {
      defaultValue: '',
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
