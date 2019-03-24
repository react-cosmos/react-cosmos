import * as React from 'react';
import { render, fireEvent, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup, mockMethodsOf } from '../../../testHelpers/plugin';
import { RouterSpec } from '../../Router/public';
import { RendererCoreSpec } from '../../RendererCore/public';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins(unselectFixture = () => {}) {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => ({ path: 'foo', name: null }),
    isFullScreen: () => false,
    unselectFixture
  });
  mockMethodsOf<RendererCoreSpec>('rendererCore', {
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

it('renders disabled fullscreen button', async () => {
  registerTestPlugins();
  const { getByText } = loadTestPlugins();
  expect(getByText(/fullscreen/i)).toHaveAttribute('disabled');
});
