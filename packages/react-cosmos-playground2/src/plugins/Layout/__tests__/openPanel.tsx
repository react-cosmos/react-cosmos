import { render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, Slot } from 'react-plugin';
import { register } from '..';
import { cleanup } from '../../../testHelpers/plugin';
import {
  getLayoutMethods,
  mockCore,
  mockRendererCore,
  mockRouter,
  mockStorage
} from '../../../testHelpers/pluginMocks';
import { PANEL_OPEN_STORAGE_KEY } from '../panelOpen';

afterEach(cleanup);

function registerTestPlugins() {
  mockRouter();
  mockCore();
  mockRendererCore();
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
