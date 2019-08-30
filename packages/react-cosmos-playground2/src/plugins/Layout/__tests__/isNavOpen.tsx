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
import { NAV_OPEN_STORAGE_KEY } from '../navOpen';

afterEach(resetPlugins);

function registerTestPlugins() {
  mockRouter();
  mockCore();
  mockRendererCore();
  register();
}

function mockNavStorage(navOpen: void | boolean) {
  const mocks: Record<string, unknown> = {
    [NAV_OPEN_STORAGE_KEY]: navOpen
  };
  mockStorage({
    loadCache: () => Promise.resolve(null),
    getItem: (context, key: string) => mocks[key]
  });
}

async function loadTestPlugins() {
  loadPlugins();
  return renderAsync(<Slot name="root" />);
}

it('returns open nav by default', async () => {
  mockNavStorage();
  registerTestPlugins();
  await loadTestPlugins();

  const layout = getLayoutMethods();
  expect(layout.isNavOpen()).toBe(true);
});

it('returns closed nav', async () => {
  mockNavStorage(false);
  registerTestPlugins();
  await loadTestPlugins();

  const layout = getLayoutMethods();
  expect(layout.isNavOpen()).toBe(false);
});

it('returns open nav', async () => {
  mockNavStorage(true);
  registerTestPlugins();
  await loadTestPlugins();

  const layout = getLayoutMethods();
  expect(layout.isNavOpen()).toBe(true);
});
