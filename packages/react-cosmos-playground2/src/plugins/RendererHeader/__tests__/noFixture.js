// @flow

import React from 'react';
import { render, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup, mockState, mockMethod } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockState('router', { urlParams: {} });
  mockMethod('rendererCoordinator.isRendererConnected', () => true);
  mockMethod('rendererCoordinator.isValidFixtureSelected', () => false);
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
