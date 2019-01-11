// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockState, mockMethod } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins({ rendererPreviewVisible }) {
  register();
  mockState('router', { urlParams: { fixturePath: 'foo.js' } });
  mockState('rendererPreview', { urlStatus: 'unknown' });
  mockMethod('renderer.isReady', () => true);
  mockMethod('renderer.isValidFixturePath', () => true);
  mockMethod('rendererPreview.isVisible', () => rendererPreviewVisible);
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="contentOverlay" />);
}

describe('does not render anything', () => {
  it('when renderer preview is visible', () => {
    registerTestPlugins({ rendererPreviewVisible: true });
    const { container } = loadTestPlugins();

    expect(container).toMatchInlineSnapshot(`<div />`);
  });

  it('when renderer preview is NOT visible', () => {
    registerTestPlugins({ rendererPreviewVisible: false });
    const { container } = loadTestPlugins();

    expect(container).toMatchInlineSnapshot(`<div />`);
  });
});
