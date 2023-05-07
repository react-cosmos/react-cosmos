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
  'renders initially selected named fixture',
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
  'renders initially selected unnamed fixture',
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
  'posts ready response on mount with initialFixtureId',
  {
    rendererId,
    searchParams: { fixtureId: { path: 'second' } },
    fixtures,
  },
  async ({ rendererReady }) => {
    await rendererReady({
      rendererId,
      fixtures: {
        first: { type: 'multi', fixtureNames: ['one'] },
        second: { type: 'single' },
      },
      selectedFixtureId: { path: 'second' },
    });
  }
);
