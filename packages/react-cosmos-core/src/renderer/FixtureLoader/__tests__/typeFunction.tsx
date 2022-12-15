import React from 'react';
import { uuid } from '../../../utils/uuid.js';
import { testFixtureLoader } from '../testHelpers/index.js';
import { wrapFixtures } from '../testHelpers/wrapFixture.js';

const rendererId = uuid();
const fixtures = wrapFixtures({
  first: () => <input type="text" />,
});
const fixtureId = { path: 'first' };

testFixtureLoader(
  'collects no props fixture state',
  { rendererId, fixtures },
  async ({ selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [],
      },
    });
  }
);
