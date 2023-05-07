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
    lazy: true,
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
    lazy: true,
  },
  async ({ renderer }) => {
    await retry(() => expect(renderer.toJSON()).toBe('Second'));
  }
);

testRenderer(
  'posts lazy fixture list with names on mount with selected fixture',
  {
    rendererId,
    searchParams: { fixtureId: { path: 'first' } },
    fixtures,
    lazy: true,
  },
  async ({ rendererReady, fixtureListUpdate }) => {
    await rendererReady({
      rendererId,
      selectedFixtureId: { path: 'first' },
    });
    await fixtureListUpdate({
      rendererId,
      fixtures: {
        first: { type: 'multi', fixtureNames: ['one'] },
        second: { type: 'single' },
      },
    });
  }
);
