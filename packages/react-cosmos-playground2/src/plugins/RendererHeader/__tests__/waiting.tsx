import React from 'react';
import { render, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import { mockRouter, mockRendererCore } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockRouter({
    getSelectedFixtureId: () => null
  });
  mockRendererCore({
    isRendererConnected: () => false,
    isValidFixtureSelected: () => false
  });
}

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="rendererHeader" />);
}

it('renders waiting state message', async () => {
  registerTestPlugins();
  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(/waiting for renderer/i));
});
