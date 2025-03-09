import { fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';
import { applyFixtureStateChange, FixtureState } from 'react-cosmos-core';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import { RendererActionSlot } from '../../../slots/RendererActionSlot.js';
import {
  mockRendererCore,
  mockRouter,
  mockStorage,
} from '../../../testHelpers/pluginMocks.js';
import { register } from '../index.js';
import {
  DEFAULT_DEVICES,
  DEFAULT_VIEWPORT_STATE,
  VIEWPORT_STORAGE_KEY,
  ViewportState,
} from '../shared.js';
import { StorageMock } from '../testHelpers/index.js';

beforeEach(() => {
  register();
  mockRouter();
});

afterEach(resetPlugins);

function mockEnabledViewportStorage() {
  const viewportState: ViewportState = {
    ...DEFAULT_VIEWPORT_STATE,
    enabled: true,
  };
  const storageMock: StorageMock = {
    [VIEWPORT_STORAGE_KEY]: viewportState,
  };
  mockStorage({
    getItem: (context, key: string) => storageMock[key],
    setItem: (context, key, value) => {
      storageMock[key] = value;
    },
  });
  return storageMock;
}

function mockRendererUrl() {
  mockRendererCore({
    getRendererUrl: () => `/_renderer.html`,
  });
}

function mockFixtureState() {
  const mocks: FixtureState = {};

  mockRendererCore({
    getRendererUrl: () => `/_renderer.html`,
    setFixtureState: (context, name, update) => {
      mocks[name] = applyFixtureStateChange(mocks[name], update);
    },
  });

  return mocks;
}

function loadTestPlugins() {
  loadPlugins();
  return render(
    <>
      <RendererActionSlot
        slotProps={{ fixtureId: { path: 'foo.js' } }}
        plugOrder={[]}
      />
      <Slot name="rendererPreviewOuter">
        <div data-testid="previewMock" />
      </Slot>
    </>
  );
}

async function toggleResponsiveMode({ getByTitle }: RenderResult) {
  fireEvent.click(getByTitle(/toggle responsive mode/i));
}

async function selectViewport({ getByTestId }: RenderResult, value: string) {
  fireEvent.change(getByTestId('viewportSelect'), { target: { value } });
}

it('renders children of "rendererPreviewOuter" slot', async () => {
  mockStorage();
  mockRendererUrl();

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);
  renderer.getByTestId('previewMock');
});

it('renders responsive header', async () => {
  mockEnabledViewportStorage();
  mockRendererUrl();

  const renderer = loadTestPlugins();
  renderer.getByTestId('responsiveHeader');
});

it('renders responsive device labels', async () => {
  mockEnabledViewportStorage();
  mockRendererUrl();

  const renderer = loadTestPlugins();
  for (const device of DEFAULT_DEVICES) {
    renderer.getByText(device.label, { selector: 'option' });
  }
});

it('sets viewport in fixture state on device select', async () => {
  mockEnabledViewportStorage();
  const fsMock = mockFixtureState();

  const renderer = loadTestPlugins();
  await selectViewport(renderer, '428x926');

  expect(fsMock.viewport).toEqual({
    width: 428,
    height: 926,
  });
});

it('saves viewport in storage on device select', async () => {
  const storageMock = mockEnabledViewportStorage();
  mockRendererUrl();

  const renderer = loadTestPlugins();
  await selectViewport(renderer, '428x926');

  expect(storageMock[VIEWPORT_STORAGE_KEY]).toEqual({
    enabled: true,
    scaled: true,
    viewport: { width: 428, height: 926 },
  });
});

it('clears viewport in fixture state on untoggle', async () => {
  mockEnabledViewportStorage();
  const fsMock = mockFixtureState();

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);

  expect(fsMock.viewport).toEqual(null);
});

it('sets disabled viewport state on untoggle', async () => {
  const storageMock = mockEnabledViewportStorage();
  mockFixtureState();

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);

  expect(storageMock[VIEWPORT_STORAGE_KEY]).toEqual(
    expect.objectContaining({ enabled: false })
  );
});
