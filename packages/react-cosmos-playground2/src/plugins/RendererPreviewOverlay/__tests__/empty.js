// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockState, mockMethod } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins(isValidFixturePath) {
  register();
  mockState('router', { urlParams: { fixturePath: 'foo.js' } });
  mockMethod('renderer.isValidFixturePath', () => isValidFixturePath);
  mockMethod('renderer.getPrimaryRendererState', () => ({}));
}

function getEmptyIllustration({ queryByTestId }) {
  return queryByTestId('empty');
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="rendererPreviewOverlay" />);
}

it('renders "empty" illustration', () => {
  registerTestPlugins(false);
  const renderer = loadTestPlugins();

  expect(getEmptyIllustration(renderer)).not.toBeNull();
});

it('does not render "empty" illustration', () => {
  registerTestPlugins(true);
  const renderer = loadTestPlugins();

  expect(getEmptyIllustration(renderer)).toBeNull();
});
