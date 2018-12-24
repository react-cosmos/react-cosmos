/* eslint-env browser */
// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockState } from '../../testHelpers/plugin';
import { register } from '.';

afterEach(cleanup);

function registerTestPlugins({ urlParams = {} } = {}) {
  register();
  mockState('router', { urlParams });
}

function getBlankCanvasIllustration({ queryByTestId }) {
  return queryByTestId('blankCanvasIcon');
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="rendererPreviewOverlay" />);
}

it('does not render "blank canvas" illustration', () => {
  registerTestPlugins();
  const renderer = loadTestPlugins();

  expect(getBlankCanvasIllustration(renderer)).not.toBeNull();
});

it('renders "blank canvas" illustration', () => {
  registerTestPlugins({ urlParams: { fixturePath: 'foo.js' } });
  const renderer = loadTestPlugins();

  expect(getBlankCanvasIllustration(renderer)).toBeNull();
});
