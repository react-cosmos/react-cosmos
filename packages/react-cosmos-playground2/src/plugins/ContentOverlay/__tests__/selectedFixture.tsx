import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import {
  mockRouter,
  mockRendererCore,
  mockRendererPreview
} from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockRouter({
    getSelectedFixtureId: () => ({ path: 'foo.js', name: null })
  });
  mockRendererCore({
    isRendererConnected: () => true,
    isValidFixtureSelected: () => true
  });
  mockRendererPreview({
    getUrlStatus: () => 'ok',
    getRuntimeStatus: () => 'connected'
  });
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
