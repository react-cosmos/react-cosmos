import { uuid } from 'react-cosmos-core';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

const rendererId = uuid();
const fixtures = wrapDefaultExport({
  first: { a: null, b: null, c: null },
  second: null,
});

testRenderer(
  'posts lazy ready response on mount',
  { rendererId, fixtures, lazy: true },
  async ({ rendererReady }) => {
    await rendererReady({
      rendererId,
    });
  }
);

testRenderer(
  'posts lazy fixture list with fixture names on fixture select',
  { rendererId, fixtures, lazy: true },
  async ({ selectFixture, fixtureListUpdate }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'first' },
      fixtureState: {},
    });
    await fixtureListUpdate({
      rendererId,
      fixtures: {
        first: { type: 'multi', fixtureNames: ['a', 'b', 'c'] },
        second: { type: 'single' },
      },
    });
  }
);
