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
  mockState('rendererPreview', { urlStatus: 'unknown' });
  mockMethod('renderer.isReady', () => true);
  mockMethod('renderer.isValidFixturePath', () => true);
  mockMethod('rendererPreview.shouldShow', () => true);
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="contentOverlay" />);
}

it('does not render anything', () => {
  registerTestPlugins();
  const { container } = loadTestPlugins();

  expect(container).toMatchInlineSnapshot(`<div />`);
});
