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
  register();
}

function mockPanelStorage(panelOpen: void | boolean) {
  const mocks: Record<string, unknown> = {
    [PANEL_OPEN_STORAGE_KEY]: panelOpen
  };
  mockStorage({
    loadCache: () => Promise.resolve(null),
    getItem: (context, key: string) => mocks[key]
  });
}

function mockValidFixtureSelected(validFixtureSelected: boolean) {
  mockRendererCore({
    isValidFixtureSelected: () => validFixtureSelected
  });
}

async function loadTestPlugins() {
  loadPlugins();
  return renderAsync(<Slot name="root" />);
}

it('returns closed panel when no valid fixture is selected', async () => {
  mockPanelStorage(true);
  mockValidFixtureSelected(false);
  registerTestPlugins();
  await loadTestPlugins();

  const layout = getLayoutMethods();
  expect(layout.isPanelOpen()).toBe(false);
});

it('returns open panel by default', async () => {
  mockPanelStorage();
  mockValidFixtureSelected(true);
  registerTestPlugins();
  await loadTestPlugins();

  const layout = getLayoutMethods();
  expect(layout.isPanelOpen()).toBe(true);
});

it('returns closed panel', async () => {
  mockPanelStorage(false);
  mockValidFixtureSelected(true);
  registerTestPlugins();
  await loadTestPlugins();

  const layout = getLayoutMethods();
  expect(layout.isPanelOpen()).toBe(false);
});

it('returns open panel', async () => {
  mockPanelStorage(true);
  mockValidFixtureSelected(true);
  registerTestPlugins();
  await loadTestPlugins();

  const layout = getLayoutMethods();
  expect(layout.isPanelOpen()).toBe(true);
});
