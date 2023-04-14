import React from 'react';
import { createValues } from '../../fixtureState/createValues.js';
import { uuid } from '../../utils/uuid.js';
import { anyProps } from '../testHelpers/fixtureState.js';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapFixtures } from '../testHelpers/wrapFixture.js';

const rendererId = uuid();
const fixtureId = { path: 'first' };

testRenderer(
  'collects fixture state for interesting string element type',
  { rendererId, fixtures: wrapFixtures({ first: <input type="text" /> }) },
  async ({ selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
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

testRenderer(
  'collects no fixture state for uninteresting string element type',
  { rendererId, fixtures: wrapFixtures({ first: <div>yo</div> }) },
  async ({ selectFixture, fixtureStateChange }) => {
    selectFixture({ rendererId, fixtureId, fixtureState: {} });
    await fixtureStateChange({
      rendererId,
      fixtureId,
      fixtureState: {
        props: [],
      },
    });
  }
);
