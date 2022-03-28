import { render } from '@testing-library/react';
import React from 'react';
import {
  mockRendererCore,
  mockRendererPreview,
  mockRouter,
  mockStorage,
} from 'react-cosmos-shared2/ui';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';

beforeEach(() => jest.isolateModules(() => require('..')));

afterEach(resetPlugins);

function registerTestPlugins() {
  mockStorage();
  mockRouter({
    getSelectedFixtureId: () => ({ path: 'foo.js' }),
  });
  mockRendererCore({
    isRendererConnected: () => true,
    isValidFixtureSelected: () => true,
  });
  mockRendererPreview({
    getUrlStatus: () => 'ok',
    getRuntimeStatus: () => 'connected',
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
