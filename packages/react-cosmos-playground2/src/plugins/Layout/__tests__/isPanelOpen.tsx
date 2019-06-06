import React from 'react';
import { render } from 'react-testing-library';
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

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="root" />);
}

it('returns closed panel when no valid fixture is selected', async () => {
  mockPanelStorage();
  mockValidFixtureSelected(false);
  registerTestPlugins();
  loadTestPlugins();

  const layout = getLayoutMethods();
  expect(layout.isPanelOpen()).toBe(false);
});

it('returns open panel by default', async () => {
  mockPanelStorage();
  mockValidFixtureSelected(true);
  registerTestPlugins();
  loadTestPlugins();

  const layout = getLayoutMethods();
  expect(layout.isPanelOpen()).toBe(true);
});

it('returns closed panel closed panel if previously so', async () => {
  mockPanelStorage(false);
  mockValidFixtureSelected(true);
  registerTestPlugins();
  loadTestPlugins();

  const layout = getLayoutMethods();
  expect(layout.isPanelOpen()).toBe(false);
});

it('returns open panel closed panel if previously so', async () => {
  mockPanelStorage(true);
  mockValidFixtureSelected(true);
  registerTestPlugins();
  loadTestPlugins();

  const layout = getLayoutMethods();
  expect(layout.isPanelOpen()).toBe(true);
});
