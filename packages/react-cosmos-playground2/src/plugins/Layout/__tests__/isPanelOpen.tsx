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
  mockPanelStorage(true);
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

it('returns closed panel', async () => {
  mockPanelStorage(false);
  mockValidFixtureSelected(true);
  registerTestPlugins();
  loadTestPlugins();

  const layout = getLayoutMethods();
  expect(layout.isPanelOpen()).toBe(false);
});

it('returns open panel', async () => {
  mockPanelStorage(true);
  mockValidFixtureSelected(true);
  registerTestPlugins();
  loadTestPlugins();

  const layout = getLayoutMethods();
  expect(layout.isPanelOpen()).toBe(true);
});
