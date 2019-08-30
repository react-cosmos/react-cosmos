import React from 'react';
import { render } from '@testing-library/react';
import { Slot, loadPlugins, resetPlugins } from 'react-plugin';
import { mockRouter, mockRendererCore } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(resetPlugins);

function registerTestPlugins() {
  register();
  mockRouter({
    getSelectedFixtureId: () => ({ path: 'foo', name: null })
  });
  mockRendererCore({
    isRendererConnected: () => true,
    isValidFixtureSelected: () => false
  });
}

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="rendererAction" />);
}

it('renders disabled fullscreen button', async () => {
  registerTestPlugins();
  const { getByTitle } = loadTestPlugins();
  expect(getByTitle(/go fullscreen/i)).toHaveAttribute('disabled');
});
