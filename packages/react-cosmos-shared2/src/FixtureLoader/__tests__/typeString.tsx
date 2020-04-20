import React from 'react';
import { createValues } from '../../fixtureState';
import { uuid } from '../../util';
import { testFixtureLoader } from '../testHelpers';
import { anyProps } from '../testHelpers/fixtureState';

const rendererId = uuid();
const fixtureId = { path: 'first', name: null };

testFixtureLoader(
  'collects fixture state for interesting string element type',
  { rendererId, fixtures: { first: <input type="text" /> } },
  async ({ selectFixture, fixtureStateChange }) => {
    await selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [
          anyProps({
            componentName: 'input',
            values: createValues({ type: 'text' }),
          }),
        ],
      },
    });
  }
);

testFixtureLoader(
  'collects no fixture state for uninteresting string element type',
  { rendererId, fixtures: { first: <div>yo</div> } },
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
