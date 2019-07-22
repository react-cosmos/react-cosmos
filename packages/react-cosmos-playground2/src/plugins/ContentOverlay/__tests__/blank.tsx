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
import { DISMISS_STATE_STORAGE_KEY } from '../welcomeDismissState';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  const storage: Record<string, unknown> = {
    [DISMISS_STATE_STORAGE_KEY]: true
  };
  mockStorage({
    getItem: (context, key: string) => storage[key]
  });
  mockRouter({
    getSelectedFixtureId: () => null
  });
  mockRendererCore({
    isRendererConnected: () => true,
    isValidFixtureSelected: () => false
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

it('renders "blank" state', () => {
  registerTestPlugins();
  const { queryByTestId } = loadTestPlugins();
  expect(queryByTestId('blank')).not.toBeNull();
});
