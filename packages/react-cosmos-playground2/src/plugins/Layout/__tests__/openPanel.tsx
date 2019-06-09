import React from 'react';
import { render } from '@testing-library/react';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import {
  mockStorage,
  mockRouter,
  mockCore,
  mockRendererCore,
  getLayoutMethods
} from '../../../testHelpers/pluginMocks';
import { PANEL_OPEN_STORAGE_KEY } from '../shared';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  mockRouter({
    isFullScreen: () => false
  });
  mockCore();
  mockRendererCore({
    isValidFixtureSelected: () => false
  });
  register();
}

function mockStorageCache() {
  return mockStorage({
    loadCache: () => Promise.resolve(null)
  });
}

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="root" />);
}

it('stores closed panel state', async () => {
  registerTestPlugins();
  const { setItem } = mockStorageCache();
  loadTestPlugins();

  const layout = getLayoutMethods();
  layout.openPanel(false);
  expect(setItem).toBeCalledWith(
    expect.any(Object),
    PANEL_OPEN_STORAGE_KEY,
    false
  );
});

it('stores open panel state', async () => {
  registerTestPlugins();
  const { setItem } = mockStorageCache();
  loadTestPlugins();

  const layout = getLayoutMethods();
  layout.openPanel(true);
  expect(setItem).toBeCalledWith(
    expect.any(Object),
    PANEL_OPEN_STORAGE_KEY,
    true
  );
});
