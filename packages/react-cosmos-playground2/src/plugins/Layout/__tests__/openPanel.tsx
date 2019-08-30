import React from 'react';
import { loadPlugins, Slot, resetPlugins } from 'react-plugin';
import { register } from '..';
import {
  getLayoutMethods,
  mockCore,
  mockRendererCore,
  mockRouter,
  mockStorage
} from '../../../testHelpers/pluginMocks';
import { renderAsync } from '../../../testHelpers/render';
import { PANEL_OPEN_STORAGE_KEY } from '../panelOpen';

afterEach(resetPlugins);

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

async function loadTestPlugins() {
  loadPlugins();
  return await renderAsync(<Slot name="root" />);
}

it('stores closed panel state', async () => {
  registerTestPlugins();
  const { setItem } = mockStorageCache();
  await loadTestPlugins();

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
  await loadTestPlugins();

  const layout = getLayoutMethods();
  layout.openPanel(true);
  expect(setItem).toBeCalledWith(
    expect.any(Object),
    PANEL_OPEN_STORAGE_KEY,
    true
  );
});
