// @flow

import React from 'react';
import { render, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup, mockState, mockMethod } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins(handleSetUrlParams = () => {}) {
  register();
  mockState('router', { urlParams: {} });
  mockState('rendererPreview', { compileError: true });
  mockMethod('router.setUrlParams', handleSetUrlParams);
  mockMethod('renderer.getPrimaryRendererState', () => ({}));
  mockMethod('renderer.isValidFixturePath', () => false);
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="fixtureHeader" />);
}

it('renders renderer-related error message', async () => {
  registerTestPlugins();
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/renderer not responding/i));
});

it('renders link to ask for help', async () => {
  registerTestPlugins();
  const { getByText } = loadTestPlugins();

  const getLink = () => getByText(/ask for help/i);
  await waitForElement(getLink);

  expect(getLink().href).toMatch('https://join-react-cosmos.now.sh');
});
