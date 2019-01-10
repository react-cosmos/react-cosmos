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
  mockState('rendererPreview', { status: 'notResponding' });
  mockMethod('renderer.getPrimaryRendererState', () => ({}));
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="rendererPreviewOverlay" />);
}

it('renders "error" state', () => {
  registerTestPlugins();
  const { queryByTestId } = loadTestPlugins();

  expect(queryByTestId('error')).not.toBeNull();
});
