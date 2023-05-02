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
  { rendererId, fixtures, selectedFixtureId: { path: 'first', name: 'one' } },
  async ({ renderer }) => {
    await retry(() => expect(renderer.toJSON()).toBe('First'));
  }
);

testRenderer(
  'renders auto selected unnamed fixture',
  { rendererId, fixtures, selectedFixtureId: { path: 'second' } },
  async ({ renderer }) => {
    await retry(() => expect(renderer.toJSON()).toBe('Second'));
  }
);
