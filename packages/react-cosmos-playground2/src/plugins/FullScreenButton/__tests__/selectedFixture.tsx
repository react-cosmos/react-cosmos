import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import { mockRouter, mockRendererCore } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockRendererCore({
    isRendererConnected: () => true,
    isValidFixtureSelected: () => true
  });
}

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="rendererActions" />);
}

it('renders fullscreen button', async () => {
  registerTestPlugins();
  const { selectFixture } = mockRouter({
    getSelectedFixtureId: () => ({ path: 'foo', name: null })
  });

  const { getByTitle } = loadTestPlugins();
  fireEvent.click(getByTitle(/go fullscreen/i));

  expect(selectFixture).toBeCalledWith(
    expect.any(Object),
    { path: 'foo', name: null },
    true
  );
});
