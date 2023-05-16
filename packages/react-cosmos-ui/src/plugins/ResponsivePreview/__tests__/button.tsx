import { render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import { RendererActionSlot } from '../../../slots/RendererActionSlot.js';
import {
  mockRendererCore,
  mockStorage,
} from '../../../testHelpers/pluginMocks.js';

beforeEach(register);

afterEach(resetPlugins);

const fixtureId = { path: 'foo.js' };

function loadTestPlugins() {
  loadPlugins();
  return render(
    <RendererActionSlot slotProps={{ fixtureId }} plugOrder={[]} />
  );
}

it('renders responsive preview button', async () => {
  mockStorage();
  mockRendererCore({
    getRendererUrl: () => `/_renderer.html`,
    getFixtureState: () => ({}),
  });

  const { getByTitle } = loadTestPlugins();
  getByTitle(/toggle responsive mode/i);
});

it('does not render responsive preview button without renderer URL', async () => {
  mockStorage();
  mockRendererCore({
    getRendererUrl: () => null,
    getFixtureState: () => ({}),
  });

  const { queryByTitle } = loadTestPlugins();
  expect(queryByTitle(/toggle responsive mode/i)).toBeNull();
});
