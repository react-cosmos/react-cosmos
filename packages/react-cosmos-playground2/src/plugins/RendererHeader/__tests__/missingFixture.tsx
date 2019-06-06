import React from 'react';
import { render, fireEvent, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import { mockRouter, mockRendererCore } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  const { unselectFixture } = mockRouter({
    getSelectedFixtureId: () => ({ path: 'foo', name: null })
  });
  mockRendererCore({
    isRendererConnected: () => true,
    isValidFixtureSelected: () => false
  });
  return { unselectFixture };
}

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="rendererHeader" />);
}

it('renders missing state message', async () => {
  registerTestPlugins();
  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(/fixture not found/i));
});

it('renders home button', async () => {
  const { unselectFixture } = registerTestPlugins();
  const { getByTitle } = loadTestPlugins();
  fireEvent.click(getByTitle(/go home/i));
  expect(unselectFixture).toBeCalledWith(expect.any(Object));
});
