import { render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, Slot } from 'react-plugin';
import { register } from '..';
import { cleanup } from '../../../testHelpers/plugin';
import {
  mockRendererCore,
  mockRendererPreview,
  mockRouter,
  mockStorage
} from '../../../testHelpers/pluginMocks';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockStorage();
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
