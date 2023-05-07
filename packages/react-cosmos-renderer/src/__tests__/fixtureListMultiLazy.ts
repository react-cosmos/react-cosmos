import { uuid } from 'react-cosmos-core';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

const rendererId = uuid();
const fixtures = wrapDefaultExport({
  first: { a: null, b: null, c: null },
  second: null,
});

testRenderer(
  'posts lazy fixture list item update on fixture select',
  { rendererId, fixtures, lazy: true },
  async ({ selectFixture, fixtureListUpdate, fixtureListItemUpdate }) => {
    await fixtureListUpdate({
      rendererId,
      fixtures: {
        first: { type: 'single' },
        second: { type: 'single' },
      },
    });
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
