import React from 'react';
import { FixtureId } from '../../../core/types';
import { useValue } from '../../../renderer/useValue';
import { fixtures } from '../../testHelpers/dataMocks';
import { FixtureSearchOverlay } from './FixtureSearchOverlay';

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
