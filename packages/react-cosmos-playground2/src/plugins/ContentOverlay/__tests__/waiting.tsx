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
    getSelectedFixtureId: () => null,
  });
  mockRendererCore({
    isRendererConnected: () => false,
    isValidFixtureSelected: () => false,
  });
  mockRendererPreview({
    getUrlStatus: () => 'unknown',
    getRuntimeStatus: () => 'pending',
  });
}

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="contentOverlay" />);
}

it('renders "waiting" state', () => {
  registerTestPlugins();
  const { queryByTestId } = loadTestPlugins();
  expect(queryByTestId('waiting')).not.toBeNull();
});
