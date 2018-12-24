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
}

function getBlankCanvasIllustration({ queryByTestId }) {
  return queryByTestId('blankCanvas');
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="rendererPreviewOverlay" />);
}

it('renders "blank canvas" illustration', () => {
  registerTestPlugins({});
  const renderer = loadTestPlugins();

  expect(getBlankCanvasIllustration(renderer)).not.toBeNull();
});

it('does not render "blank canvas" illustration', () => {
  registerTestPlugins({ fixturePath: 'foo.js' });
  const renderer = loadTestPlugins();

  expect(getBlankCanvasIllustration(renderer)).toBeNull();
});
