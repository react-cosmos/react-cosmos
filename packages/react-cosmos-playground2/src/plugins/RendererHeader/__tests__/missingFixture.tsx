import * as React from 'react';
import { render, fireEvent, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import { mockRouter, mockRendererCore } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins(unselectFixture = () => {}) {
  register();
  mockRouter({
    getSelectedFixtureId: () => ({ path: 'foo', name: null }),
    unselectFixture
  });
  mockRendererCore({
    isRendererConnected: () => true,
    isValidFixtureSelected: () => false
  });
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
  const unselectFixture = jest.fn();
  registerTestPlugins(unselectFixture);

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/home/));

  expect(unselectFixture).toBeCalledWith(expect.any(Object));
});
