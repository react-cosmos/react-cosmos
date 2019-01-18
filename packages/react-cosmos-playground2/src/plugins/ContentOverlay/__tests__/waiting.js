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
  mockState('rendererPreview', {
    urlStatus: 'unknown',
    runtimeStatus: 'unknown'
  });
  mockMethod('rendererCoordinator.isRendererConnected', () => false);
  mockMethod('rendererCoordinator.isValidFixtureSelected', () => false);
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="contentOverlay" />);
}

it('renders "waiting" state', () => {
  registerTestPlugins();
  const { queryByTestId } = loadTestPlugins();

  expect(queryByTestId('waiting')).not.toBeNull();
});
