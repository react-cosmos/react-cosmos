// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockState, mockMethod } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins(rendererPreviewStatus) {
  register();
  mockState('router', { urlParams: {} });
  mockState('rendererPreview', { status: rendererPreviewStatus });
  mockMethod('renderer.isValidFixturePath', () => true);
  mockMethod('renderer.getPrimaryRendererState', () => null);
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="rendererPreviewOverlay" />);
}

it('renders "waiting" state', () => {
  registerTestPlugins('waiting');
  const { queryByTestId } = loadTestPlugins();

  expect(queryByTestId('waiting')).not.toBeNull();
});

it('renders "waiting" state when renderer state is null', () => {
  registerTestPlugins('ok');
  const { queryByTestId } = loadTestPlugins();

  expect(queryByTestId('waiting')).not.toBeNull();
});
