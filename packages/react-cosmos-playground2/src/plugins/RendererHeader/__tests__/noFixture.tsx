import * as React from 'react';
import { render, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup, mockMethodsOf } from '../../../testHelpers/plugin';
import { RouterSpec } from '../../Router/public';
import { RendererCoreSpec } from '../../RendererCore/public';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => null,
    isFullScreen: () => false
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
