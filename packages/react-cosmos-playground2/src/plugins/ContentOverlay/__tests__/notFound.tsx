import { render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, Slot, resetPlugins } from 'react-plugin';
import { register } from '..';
import {
  mockRendererCore,
  mockRendererPreview,
  mockRouter,
  mockStorage,
} from '../../../testHelpers/pluginMocks';

afterEach(resetPlugins);

function registerTestPlugins() {
  register();
  mockStorage();
  mockRouter({
    getSelectedFixtureId: () => ({ path: 'foo.js', name: null }),
  });
  mockRendererCore({
    isRendererConnected: () => true,
    isValidFixtureSelected: () => false,
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

it('renders "notFound" state', () => {
  registerTestPlugins();
  const { queryByTestId } = loadTestPlugins();
  expect(queryByTestId('notFound')).not.toBeNull();
});
