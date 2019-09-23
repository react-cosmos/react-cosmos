import { fireEvent, render, waitForElement } from '@testing-library/react';
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
  const { unselectFixture } = mockRouter({
    getSelectedFixtureId: () => ({ path: 'foo', name: null })
  });
  mockLayout();
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
