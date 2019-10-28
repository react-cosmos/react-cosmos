import { render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import { RendererActionSlot } from '../../../shared/slots/RendererActionSlot';
import {
  mockCore,
  mockRendererCore,
  mockStorage
} from '../../../testHelpers/pluginMocks';

afterEach(resetPlugins);

const fixtureId = { path: 'foo.js', name: null };

function loadTestPlugins() {
  loadPlugins();
  return render(
    <RendererActionSlot slotProps={{ fixtureId }} plugOrder={[]} />
  );
}

it('renders responsive preview button', async () => {
  register();
  mockStorage();
  mockCore({ getWebRendererUrl: () => `/_renderer.html` });
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true
  });

  const { getByTitle } = loadTestPlugins();
  getByTitle(/toggle responsive mode/i);
});

it('does not render responsive preview button without renderer URL', async () => {
  register();
  mockStorage();
  mockCore({ getWebRendererUrl: () => null });
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true
  });

  const { queryByTitle } = loadTestPlugins();
  expect(queryByTitle(/toggle responsive mode/i)).toBeNull();
});
