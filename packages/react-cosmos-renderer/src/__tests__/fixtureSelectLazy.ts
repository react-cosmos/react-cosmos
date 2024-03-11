import { uuid } from 'react-cosmos-core';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapActSetTimeout } from '../testHelpers/wrapActSetTimeout.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

beforeAll(wrapActSetTimeout);

const rendererId = uuid();
const fixtures = wrapDefaultExport({
  first: { one: 'First' },
  second: 'Second',
});

testRenderer(
  'returns lazy fixtureLoaded response for single fixture',
  { rendererId, fixtures, lazy: true },
  async ({ selectFixture, fixtureLoaded }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'second' },
      fixtureState: {},
    });
    await fixtureLoaded({
      rendererId,
      fixture: { type: 'single' },
    });
  }
);

testRenderer(
  'returns lazy fixtureLoaded response for multi fixture',
  { rendererId, fixtures, lazy: true },
  async ({ selectFixture, fixtureLoaded }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'first', name: 'one' },
      fixtureState: {},
    });
    await fixtureLoaded({
      rendererId,
      fixture: { type: 'multi', fixtureNames: ['one'] },
    });
  }
);
