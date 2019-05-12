import * as React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { runFixtureLoaderTests } from '../../testHelpers';

const rendererId = uuid();
const decorators = {};
const fixtureId = { path: 'first', name: null };
const fixtures = {
  first: () => <input type="text" />
};

runFixtureLoaderTests(mount => {
  it('collects no props fixture state', async () => {
    await mount(
      { rendererId, fixtures, decorators },
      async ({ selectFixture, fixtureStateChange }) => {
        await selectFixture({
          rendererId,
          fixtureId,
          fixtureState: {}
        });
        await fixtureStateChange({
          rendererId,
          fixtureId,
          fixtureState: {
            props: []
          }
        });
      }
    );
  });
});
