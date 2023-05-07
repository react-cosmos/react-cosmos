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
  'renders auto selected named fixture',
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
  'renders auto selected unnamed fixture',
  {
    rendererId,
    searchParams: { fixtureId: { path: 'second' } },
    fixtures,
  },
  async ({ renderer }) => {
    await retry(() => expect(renderer.toJSON()).toBe('Second'));
  }
);
