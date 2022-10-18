import { render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { RendererActionSlot } from '../../../slots/RendererActionSlot';
import {
  mockCore,
  mockRendererCore,
  mockStorage,
} from '../../../testHelpers/pluginMocks';
import { register } from '..';

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
  mockCore({ getWebRendererUrl: () => `/_renderer.html` });
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true,
  });

  const { getByTitle } = loadTestPlugins();
  getByTitle(/toggle responsive mode/i);
});

it('does not render responsive preview button without renderer URL', async () => {
  mockStorage();
  mockCore({ getWebRendererUrl: () => null });
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true,
  });

  const { queryByTitle } = loadTestPlugins();
  expect(queryByTitle(/toggle responsive mode/i)).toBeNull();
});
