import * as React from 'react';
import { uuid } from 'react-cosmos-shared2/util';
import { createValues } from 'react-cosmos-shared2/fixtureState';
import { runFixtureLoaderTests } from '../testHelpers';
import { anyProps } from '../testHelpers/fixtureState';

const rendererId = uuid();
const decorators = {};
const fixtureId = { path: 'first', name: null };

runFixtureLoaderTests(mount => {
  it('collects fixture state for interesting string element type', async () => {
    const fixtures = {
      first: <input type="text" />
    };
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
            props: [
              anyProps({
                componentName: 'input',
                values: createValues({ type: 'text' })
              })
            ]
          }
        });
      }
    );
  });

  it('collects no fixture state for uninteresting string element type', async () => {
    const fixtures = {
      first: <div>yo</div>
    };
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
