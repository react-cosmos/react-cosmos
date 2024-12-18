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
  'renders initially selected named fixture',
  {
    rendererId,
    selectedFixtureId: { path: 'first', name: 'one' },
    fixtures,
  },
  async ({ containerText }) => {
    await waitFor(() => expect(containerText()).toBe('First'));
  }
);

testRenderer(
  'renders initially selected unnamed fixture',
  {
    rendererId,
    selectedFixtureId: { path: 'second' },
    fixtures,
  },
  async ({ containerText }) => {
    await waitFor(() => expect(containerText()).toBe('Second'));
  }
);

testRenderer(
  'posts ready response on initially selected fixture',
  {
    rendererId,
    selectedFixtureId: { path: 'second' },
    fixtures,
  },
  async ({ rendererReady }) => {
    await rendererReady({
      rendererId,
      selectedFixtureId: { path: 'second' },
    });
  }
);
