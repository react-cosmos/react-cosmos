import { fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import { register } from '..';
import { RendererActionSlot } from '../../../slots/RendererActionSlot.js';
import {
  mockCore,
  mockRendererCore,
  mockStorage,
} from '../../../testHelpers/pluginMocks.js';
import {
  DEFAULT_DEVICES,
  DEFAULT_VIEWPORT_STATE,
  FixtureStateWithViewport,
  ViewportState,
  VIEWPORT_STORAGE_KEY,
} from '../shared.js';
import { StorageMock } from '../testHelpers/index.js';

beforeEach(register);

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
  mockCore({ getWebRendererUrl: () => `/_renderer.html` });
}

function mockViewportFixtureState() {
  const mocks: { fixtureState: FixtureStateWithViewport } = {
    fixtureState: {},
  };
  mockRendererCore({
    getFixtureState: () => ({}),
    setFixtureState: (context, stateUpdater) => {
      mocks.fixtureState = stateUpdater(mocks.fixtureState);
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
  mockRendererCore({
    getFixtureState: () => ({}),
  });

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);
  renderer.getByTestId('previewMock');
});

it('renders responsive header', async () => {
  mockEnabledViewportStorage();
  mockRendererUrl();
  mockRendererCore({
    getFixtureState: () => ({}),
  });

  const renderer = loadTestPlugins();
  renderer.getByTestId('responsiveHeader');
});

it('renders responsive device labels', async () => {
  mockEnabledViewportStorage();
  mockRendererUrl();
  mockRendererCore({
    getFixtureState: () => ({}),
  });

  const renderer = loadTestPlugins();
  for (const device of DEFAULT_DEVICES) {
    renderer.getByText(device.label, { selector: 'option' });
  }
});

it('sets viewport in fixture state on device select', async () => {
  mockEnabledViewportStorage();
  mockRendererUrl();
  const mocks = mockViewportFixtureState();

  const renderer = loadTestPlugins();
  await selectViewport(renderer, '414x736');

  expect(mocks.fixtureState.viewport).toEqual({
    width: 414,
    height: 736,
  });
});

it('saves viewport in storage on device select', async () => {
  const storageMock = mockEnabledViewportStorage();
  mockRendererUrl();
  mockRendererCore({
    getFixtureState: () => ({}),
  });

  const renderer = loadTestPlugins();
  await selectViewport(renderer, '414x736');

  expect(storageMock[VIEWPORT_STORAGE_KEY]).toEqual({
    enabled: true,
    scaled: true,
    viewport: { width: 414, height: 736 },
  });
});

it('clears viewport in fixture state on untoggle', async () => {
  mockEnabledViewportStorage();
  mockRendererUrl();
  const mocks = mockViewportFixtureState();

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);

  expect(mocks.fixtureState.viewport).toEqual(null);
});

it('sets disabled viewport state on untoggle', async () => {
  const storageMock = mockEnabledViewportStorage();
  mockRendererUrl();
  mockViewportFixtureState();

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);

  expect(storageMock[VIEWPORT_STORAGE_KEY]).toEqual(
    expect.objectContaining({ enabled: false })
  );
});
