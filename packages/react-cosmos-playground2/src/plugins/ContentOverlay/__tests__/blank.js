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
  mockState('rendererPreview', { urlStatus: 'unknown' });
  mockMethod('rendererCoordinator.isRendererConnected', () => true);
  mockMethod('rendererCoordinator.isValidFixtureSelected', () => false);
  mockMethod('rendererPreview.isVisible', () => false);
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="contentOverlay" />);
}

it('renders "blank" state', () => {
  registerTestPlugins();
  const { queryByTestId } = loadTestPlugins();

  expect(queryByTestId('blank')).not.toBeNull();
});
