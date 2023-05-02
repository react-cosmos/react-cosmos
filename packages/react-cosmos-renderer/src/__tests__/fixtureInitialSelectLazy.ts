import { retry, uuid } from 'react-cosmos-core';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

const rendererId = uuid();
const fixtures = wrapDefaultExport({
  first: { one: 'First' },
  second: 'Second',
});

testRenderer(
  'renders lazy initially selected named fixture',
  { rendererId, fixtures, initialFixtureId: { path: 'first', name: 'one' } },
  async ({ renderer }) => {
    await retry(() => expect(renderer.toJSON()).toBe('First'));
  }
);

testRenderer(
  'renders lazy initially selected unnamed fixture',
  { rendererId, fixtures, initialFixtureId: { path: 'second' } },
  async ({ renderer }) => {
    await retry(() => expect(renderer.toJSON()).toBe('Second'));
  }
);

testRenderer(
  'posts lazy ready response and fixture list item update on mount with initialFixtureId',
  {
    rendererId,
    fixtures,
    initialFixtureId: { path: 'first' },
    lazy: true,
  },
  async ({ rendererReady, fixtureListItemUpdate }) => {
    await rendererReady({
      rendererId,
      fixtures: {
        first: { type: 'single' },
        second: { type: 'single' },
      },
      initialFixtureId: { path: 'first' },
    });
    await fixtureListItemUpdate({
      rendererId,
      fixturePath: 'first',
      fixtureItem: { type: 'multi', fixtureNames: ['one'] },
    });
  }
);
