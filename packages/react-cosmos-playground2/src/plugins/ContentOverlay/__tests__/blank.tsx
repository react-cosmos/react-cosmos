import { render } from '@testing-library/react';
import React from 'react';
import {
  mockRendererCore,
  mockRendererPreview,
  mockRouter,
  mockStorage,
} from 'react-cosmos-shared2/ui';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import { WELCOME_DISMISS_STORAGE_KEY } from '../welcomeDismiss';

beforeEach(() => jest.isolateModules(() => require('..')));

afterEach(resetPlugins);

function registerTestPlugins() {
  const storage: Record<string, unknown> = {
    [WELCOME_DISMISS_STORAGE_KEY]: Date.now() - 5000, // Dismissed 5s ago
  };
  mockStorage({
    getItem: (context, key: string) => storage[key],
  });
  mockRouter({
    getSelectedFixtureId: () => null,
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

it('renders "blank" state', () => {
  registerTestPlugins();
  const { queryByTestId } = loadTestPlugins();
  expect(queryByTestId('blank')).not.toBeNull();
});
