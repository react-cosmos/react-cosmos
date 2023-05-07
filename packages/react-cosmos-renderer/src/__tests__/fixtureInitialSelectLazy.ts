import retry from '@skidding/async-retry';
import { uuid } from 'react-cosmos-core';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

const rendererId = uuid();
const fixtures = wrapDefaultExport({
  first: { one: 'First' },
  second: 'Second',
});

testRenderer(
  'renders lazy initially selected named fixture',
  {
    rendererId,
    searchParams: { fixtureId: { path: 'first', name: 'one' } },
    fixtures,
  },
  async ({ renderer }) => {
    await retry(() => expect(renderer.toJSON()).toBe('First'));
  }
);

testRenderer(
  'renders lazy initially selected unnamed fixture',
  {
    rendererId,
    searchParams: { fixtureId: { path: 'second' } },
    fixtures,
  },
  async ({ renderer }) => {
    await retry(() => expect(renderer.toJSON()).toBe('Second'));
  }
);

testRenderer(
  'posts lazy ready response and fixture list item update on mount with initialFixtureId',
  {
    rendererId,
    searchParams: { fixtureId: { path: 'first' } },
    fixtures,
    lazy: true,
  },
  async ({ rendererReady, fixtureListItemUpdate }) => {
    await rendererReady({
      rendererId,
      fixtures: {
        first: { type: 'single' },
        second: { type: 'single' },
      },
      selectedFixtureId: { path: 'first' },
    });
    await fixtureListItemUpdate({
      rendererId,
      fixturePath: 'first',
      fixtureItem: { type: 'multi', fixtureNames: ['one'] },
    });
  }
);
