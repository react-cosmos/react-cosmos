// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockState, mockMethod } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins(primaryRendererState) {
  register();
  mockState('router', { urlParams: {} });
  mockMethod('renderer.isValidFixturePath', () => true);
  mockMethod('renderer.getPrimaryRendererState', () => primaryRendererState);
}

function getWaitingIllustration({ queryByTestId }) {
  return queryByTestId('waiting');
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="rendererPreviewOverlay" />);
}

it('renders "waiting" illustration', () => {
  registerTestPlugins(null);
  const renderer = loadTestPlugins();

  expect(getWaitingIllustration(renderer)).not.toBeNull();
});

it('does not render "waiting" illustration', () => {
  registerTestPlugins({});
  const renderer = loadTestPlugins();

  expect(getWaitingIllustration(renderer)).toBeNull();
});
