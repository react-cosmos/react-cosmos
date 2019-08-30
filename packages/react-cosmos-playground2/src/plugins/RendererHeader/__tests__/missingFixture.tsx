import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import { Slot, loadPlugins, resetPlugins } from 'react-plugin';
import { mockRouter, mockRendererCore } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(resetPlugins);

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
