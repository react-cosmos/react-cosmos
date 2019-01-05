// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockState, mockMethod } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins(urlParams) {
  register();
  mockState('router', { urlParams });
  mockMethod('renderer.isValidFixturePath', () => false);
  mockMethod('renderer.getPrimaryRendererState', () => ({}));
}

function getBlankIllustration({ queryByTestId }) {
  return queryByTestId('blank');
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="rendererPreviewOverlay" />);
}

it('renders "blank" illustration', () => {
  registerTestPlugins({});
  const renderer = loadTestPlugins();

  expect(getBlankIllustration(renderer)).not.toBeNull();
});

it('does not render "blank" illustration', () => {
  registerTestPlugins({ fixturePath: 'foo.js' });
  const renderer = loadTestPlugins();

  expect(getBlankIllustration(renderer)).toBeNull();
});
