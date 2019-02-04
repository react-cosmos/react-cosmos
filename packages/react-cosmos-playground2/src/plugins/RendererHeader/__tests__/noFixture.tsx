import * as React from 'react';
import { render, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup, mockMethodsOf } from '../../../testHelpers/plugin2';
import { RouterSpec } from '../../Router/public';
import { RendererCoordinatorSpec } from '../../RendererCoordinator/public';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getUrlParams: () => ({})
  });
  mockMethodsOf<RendererCoordinatorSpec>('rendererCoordinator', {
    isRendererConnected: () => true,
    isValidFixtureSelected: () => false
  });
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="rendererHeader" />);
}

it('renders blank state message', async () => {
  registerTestPlugins();
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/no fixture selected/i));
});

it('renders disabled fullscreen button', async () => {
  registerTestPlugins();
  const { getByText } = loadTestPlugins();

  expect(getByText(/fullscreen/i)).toHaveAttribute('disabled');
});
