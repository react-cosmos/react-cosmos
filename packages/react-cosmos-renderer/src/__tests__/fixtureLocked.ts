import delay from 'delay';
import { uuid } from 'react-cosmos-core';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

const rendererId = uuid();
const fixtures = wrapDefaultExport({
  first: { one: 'First' },
  second: 'Second',
});

testRenderer(
  'does not change locked fixture',
  {
    rendererId,
    selectedFixtureId: { path: 'first', name: 'one' },
    locked: true,
    fixtures,
  },
  async ({ renderer, selectFixture }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'second' },
      fixtureState: {},
    });
    await delay(50);
    expect(renderer.toJSON()).toBe('First');
  }
);

testRenderer(
  'does not close locked fixture',
  {
    rendererId,
    selectedFixtureId: { path: 'first', name: 'one' },
    locked: true,
    fixtures,
  },
  async ({ renderer, unselectFixture }) => {
    unselectFixture({ rendererId });
    await delay(50);
    expect(renderer.toJSON()).toBe('First');
  }
);
