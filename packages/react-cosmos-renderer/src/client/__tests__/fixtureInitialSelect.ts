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
  { rendererId, fixtures, initialFixtureId: { path: 'first', name: 'one' } },
  async ({ renderer }) => {
    await retry(() => expect(renderer.toJSON()).toBe('First'));
  }
);

testRenderer(
  'renders initially selected unnamed fixture',
  { rendererId, fixtures, initialFixtureId: { path: 'second' } },
  async ({ renderer }) => {
    await retry(() => expect(renderer.toJSON()).toBe('Second'));
  }
);

testRenderer(
  'posts ready response on mount with initialFixtureId',
  { rendererId, fixtures, initialFixtureId: { path: 'second' } },
  async ({ rendererReady }) => {
    await rendererReady({
      rendererId,
      fixtures: {
        first: { type: 'multi', fixtureNames: ['one'] },
        second: { type: 'single' },
      },
      initialFixtureId: { path: 'second' },
    });
  }
);
