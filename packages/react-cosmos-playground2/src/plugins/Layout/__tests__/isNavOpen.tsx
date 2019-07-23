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
import { register } from '..';
import { NAV_OPEN_STORAGE_KEY } from '../navOpen';

afterEach(cleanup);

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

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="root" />);
}

it('returns open nav by default', async () => {
  mockNavStorage();
  registerTestPlugins();
  loadTestPlugins();

  const layout = getLayoutMethods();
  expect(layout.isNavOpen()).toBe(true);
});

it('returns closed nav', async () => {
  mockNavStorage(false);
  registerTestPlugins();
  loadTestPlugins();

  const layout = getLayoutMethods();
  expect(layout.isNavOpen()).toBe(false);
});

it('returns open nav', async () => {
  mockNavStorage(true);
  registerTestPlugins();
  loadTestPlugins();

  const layout = getLayoutMethods();
  expect(layout.isNavOpen()).toBe(true);
});
