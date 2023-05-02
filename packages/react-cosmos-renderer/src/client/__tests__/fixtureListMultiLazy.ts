import { uuid } from 'react-cosmos-core';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

const rendererId = uuid();
const fixtures = wrapDefaultExport({
  first: { a: null, b: null, c: null },
  second: null,
});

testRenderer(
  'posts lazy ready response on mount without fixture names',
  { rendererId, fixtures, lazy: true },
  async ({ rendererReady }) => {
    await rendererReady({
      rendererId,
      fixtures: {
        first: { type: 'single' },
        second: { type: 'single' },
      },
    });
  }
);

testRenderer(
  'posts subsequent fixture list item update with fixture names',
  { rendererId, fixtures, lazy: true },
  async ({ selectFixture, fixtureListItemUpdate }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'first' },
      fixtureState: {},
    });
    await fixtureListItemUpdate({
      rendererId,
      fixturePath: 'first',
      fixtureItem: { type: 'multi', fixtureNames: ['a', 'b', 'c'] },
    });
  }
);
