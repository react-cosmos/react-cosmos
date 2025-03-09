import { waitFor } from '@testing-library/react';
import { uuid } from 'react-cosmos-core';
import { testRenderer } from '../testHelpers/testRenderer.js';
import { wrapDefaultExport } from '../testHelpers/wrapDefaultExport.js';

const rendererId = uuid();
const fixtures = wrapDefaultExport({
  first: { one: 'First' },
  second: 'Second',
});

testRenderer(
  'renders selected fixture',
  { rendererId, fixtures },
  async ({ rootText, selectFixture }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'second' },
      fixtureState: {},
    });
    await waitFor(() => expect(rootText()).toBe('Second'));
  }
);

testRenderer(
  'renders selected named fixture',
  { rendererId, fixtures },
  async ({ rootText, selectFixture }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'first', name: 'one' },
      fixtureState: {},
    });
    await waitFor(() => expect(rootText()).toBe('First'));
  }
);

testRenderer(
  'renders first named fixture',
  { rendererId, fixtures },
  async ({ rootText, selectFixture }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'first' },
      fixtureState: {},
    });
    await waitFor(() => expect(rootText()).toBe('First'));
  }
);

testRenderer(
  'creates fixture state',
  { rendererId, fixtures },
  async ({ selectFixture, fixtureStateChange }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'second' },
      fixtureState: {},
    });
    await fixtureStateChange({
      rendererId,
      fixtureId: { path: 'second' },
      fixtureState: {
        props: [],
      },
    });
  }
);

testRenderer(
  'renders blank state after unselecting fixture',
  { rendererId, fixtures },
  async ({ rootText, selectFixture, unselectFixture }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'first', name: 'one' },
      fixtureState: {},
    });
    await waitFor(() => expect(rootText()).toBe('First'));
    unselectFixture({ rendererId });
    await waitFor(() => expect(rootText()).toBe('No fixture selected.'));
  }
);

testRenderer(
  'ignores "selectFixture" message for different renderer',
  { rendererId, fixtures },
  async ({ rootText, selectFixture }) => {
    selectFixture({
      rendererId: 'foobar',
      fixtureId: { path: 'second' },
      fixtureState: {},
    });
    await waitFor(() => expect(rootText()).toBe('No fixture selected.'));
  }
);

testRenderer(
  'renders missing state on unknown fixture path',
  { rendererId, fixtures },
  async ({ rootText, selectFixture }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'third' },
      fixtureState: {},
    });
    await waitFor(() => expect(rootText()).toBe('Fixture not found: third'));
  }
);

testRenderer(
  'returns fixtureLoaded response for single fixture',
  { rendererId, fixtures },
  async ({ selectFixture, fixtureLoaded }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'second' },
      fixtureState: {},
    });
    await fixtureLoaded({
      rendererId,
      fixture: { type: 'single' },
      fixtureOptions: {},
    });
  }
);

testRenderer(
  'returns fixtureLoaded response for multi fixture',
  { rendererId, fixtures },
  async ({ selectFixture, fixtureLoaded }) => {
    selectFixture({
      rendererId,
      fixtureId: { path: 'first', name: 'one' },
      fixtureState: {},
    });
    await fixtureLoaded({
      rendererId,
      fixture: { type: 'multi', fixtureNames: ['one'] },
      fixtureOptions: {},
    });
  }
);
