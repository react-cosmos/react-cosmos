import { render, waitForElement } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import { register } from '..';
import {
  mockLayout,
  mockRendererCore,
  mockRouter
} from '../../../testHelpers/pluginMocks';

afterEach(resetPlugins);

function registerTestPlugins() {
  register();
  mockRouter({
    getSelectedFixtureId: () => null
  });
  mockLayout();
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
