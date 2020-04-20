import { fireEvent, render, RenderResult } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import { register } from '..';
import { RendererActionSlot } from '../../../shared/slots/RendererActionSlot';
import {
  mockCore,
  mockRendererCore,
  mockStorage,
} from '../../../testHelpers/pluginMocks';
import {
  DEFAULT_DEVICES,
  DEFAULT_VIEWPORT_STATE,
  FixtureStateWithViewport,
  ViewportState,
  VIEWPORT_STORAGE_KEY,
} from '../shared';
import { StorageMock } from '../testHelpers';

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
    isValidFixtureSelected: () => true,
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
        slotProps={{ fixtureId: { path: 'foo.js', name: null } }}
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
  register();
  mockStorage();
  mockRendererUrl();
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true,
  });

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);
  renderer.getByTestId('previewMock');
});

it('does not render responsive header when no fixture is selected', async () => {
  register();
  mockEnabledViewportStorage();
  mockRendererUrl();
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => false,
  });

  const renderer = loadTestPlugins();
  expect(renderer.queryByTestId('responsiveHeader')).toBeNull();
});

it('renders responsive header', async () => {
  register();
  mockEnabledViewportStorage();
  mockRendererUrl();
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true,
  });

  const renderer = loadTestPlugins();
  renderer.getByTestId('responsiveHeader');
});

it('renders responsive device labels', async () => {
  register();
  mockEnabledViewportStorage();
  mockRendererUrl();
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true,
  });

  const renderer = loadTestPlugins();
  for (const device of DEFAULT_DEVICES) {
    renderer.getByText(device.label, { selector: 'option' });
  }
});

it('sets viewport in fixture state on device select', async () => {
  register();
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
  register();
  const storageMock = mockEnabledViewportStorage();
  mockRendererUrl();
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true,
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
  register();
  mockEnabledViewportStorage();
  mockRendererUrl();
  const mocks = mockViewportFixtureState();

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);

  expect(mocks.fixtureState.viewport).toEqual(null);
});

it('sets disabled viewport state on untoggle', async () => {
  register();
  const storageMock = mockEnabledViewportStorage();
  mockRendererUrl();
  mockViewportFixtureState();

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);

  expect(storageMock[VIEWPORT_STORAGE_KEY]).toEqual(
    expect.objectContaining({ enabled: false })
  );
});
