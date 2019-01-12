// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockState, mockMethod } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockState('router', { urlParams: {} });
  mockState('rendererPreview', { urlStatus: 'error' });
  mockMethod('renderer.isReady', () => true);
  mockMethod('renderer.isValidFixtureSelected', () => true);
  mockMethod('rendererPreview.isVisible', () => false);
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="contentOverlay" />);
}

it('renders "error" message', () => {
  registerTestPlugins();
  const { getByText } = loadTestPlugins();

  getByText(/renderer not responding/i);
});

it('renders "help" link', () => {
  registerTestPlugins();
  const { getByText } = loadTestPlugins();

  const helpLink = getByText(/ask for help/i);
  expect(helpLink.href).toMatch('https://join-react-cosmos.now.sh');
});
