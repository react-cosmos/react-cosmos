// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockState, mockMethod } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockState('router', { urlParams: { fixturePath: 'foo.js' } });
  mockState('rendererPreview', { status: 'ok' });
  mockMethod('renderer.isValidFixturePath', () => false);
  mockMethod('renderer.getPrimaryRendererState', () => ({}));
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="contentOverlay" />);
}

it('renders "empty" state', () => {
  registerTestPlugins();
  const { queryByTestId } = loadTestPlugins();

  expect(queryByTestId('empty')).not.toBeNull();
});
