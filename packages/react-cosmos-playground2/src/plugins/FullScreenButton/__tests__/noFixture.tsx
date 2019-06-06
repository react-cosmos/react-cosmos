import React from 'react';
import { render } from '@testing-library/react';
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
    isRendererConnected: () => true,
    isValidFixtureSelected: () => false
  });
}

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="rendererActions" />);
}

it('renders disabled fullscreen button', async () => {
  registerTestPlugins();
  const { getByTitle } = loadTestPlugins();
  expect(getByTitle(/go fullscreen/i)).toHaveAttribute('disabled');
});
