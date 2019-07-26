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
import { renderAsync } from '../../../testHelpers/render';
import { NAV_OPEN_STORAGE_KEY } from '../navOpen';

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

async function loadTestPlugins() {
  loadPlugins();
  return renderAsync(<Slot name="root" />);
}

it('stores closed nav state', async () => {
  registerTestPlugins();
  const { setItem } = mockStorageCache();
  await loadTestPlugins();

  const layout = getLayoutMethods();
  layout.openNav(false);
  expect(setItem).toBeCalledWith(
    expect.any(Object),
    NAV_OPEN_STORAGE_KEY,
    false
  );
});

it('stores open nav state', async () => {
  registerTestPlugins();
  const { setItem } = mockStorageCache();
  await loadTestPlugins();

  const layout = getLayoutMethods();
  layout.openNav(true);
  expect(setItem).toBeCalledWith(
    expect.any(Object),
    NAV_OPEN_STORAGE_KEY,
    true
  );
});
