import React from 'react';
import { render, fireEvent, RenderResult } from '@testing-library/react';
import { loadPlugins, Slot, ArraySlot } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import {
  mockRouter,
  mockStorage,
  mockRendererCore
} from '../../../testHelpers/pluginMocks';
import {
  DEFAULT_DEVICES,
  VIEWPORT_STORAGE_KEY,
  ViewportState,
  DEFAULT_VIEWPORT_STATE
} from '../shared';
import { FixtureStateWithViewport, StorageMock } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

function mockEnabledViewportStorage() {
  const viewportState: ViewportState = {
    ...DEFAULT_VIEWPORT_STATE,
    enabled: true
  };
  const storageMock: StorageMock = {
    [VIEWPORT_STORAGE_KEY]: viewportState
  };
  mockStorage({
    getItem: (context, key: string) => storageMock[key],
    setItem: (context, key, value) => {
      storageMock[key] = value;
    }
  });
  return storageMock;
}

function mockViewportFixtureState() {
  const mocks: { fixtureState: FixtureStateWithViewport } = {
    fixtureState: {}
  };
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true,
    setFixtureState: (context, stateUpdater) => {
      mocks.fixtureState = stateUpdater(mocks.fixtureState);
    }
  });
  return mocks;
}

function loadTestPlugins() {
  loadPlugins();
  return render(
    <>
      <ArraySlot name="rendererAction" />
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
  mockEnabledViewportStorage();
  mockRouter({ isFullScreen: () => false });
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true
  });

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);
  renderer.getByTestId('previewMock');
});

it('does not render responsive header when no fixture is selected', async () => {
  register();
  mockEnabledViewportStorage();
  mockRouter({ isFullScreen: () => false });
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => false
  });

  const renderer = loadTestPlugins();
  expect(renderer.queryByTestId('responsiveHeader')).toBeNull();
});

it('does not render responsive header in full screen mode', async () => {
  register();
  mockEnabledViewportStorage();
  mockRouter({ isFullScreen: () => true });
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true
  });

  const renderer = loadTestPlugins();
  expect(renderer.queryByTestId('responsiveHeader')).toBeNull();
});

it('renders responsive header', async () => {
  register();
  mockEnabledViewportStorage();
  mockRouter({ isFullScreen: () => false });
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true
  });

  const renderer = loadTestPlugins();
  renderer.getByTestId('responsiveHeader');
});

it('renders responsive device labels', async () => {
  register();
  mockEnabledViewportStorage();
  mockRouter({ isFullScreen: () => false });
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true
  });

  const renderer = loadTestPlugins();
  for (const device of DEFAULT_DEVICES) {
    renderer.getByText(device.label, { selector: 'option' });
  }
});

it('sets viewport in fixture state on device select', async () => {
  register();
  mockEnabledViewportStorage();
  mockRouter({ isFullScreen: () => false });
  const mocks = mockViewportFixtureState();

  const renderer = loadTestPlugins();
  await selectViewport(renderer, '414x736');

  expect(mocks.fixtureState.viewport).toEqual({
    width: 414,
    height: 736
  });
});

it('saves viewport in storage on device select', async () => {
  register();
  const storageMock = mockEnabledViewportStorage();
  mockRouter({ isFullScreen: () => false });
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true
  });

  const renderer = loadTestPlugins();
  await selectViewport(renderer, '414x736');

  expect(storageMock[VIEWPORT_STORAGE_KEY]).toEqual({
    enabled: true,
    scaled: true,
    viewport: { width: 414, height: 736 }
  });
});

it('clears viewport in fixture state on untoggle', async () => {
  register();
  mockEnabledViewportStorage();
  mockRouter({ isFullScreen: () => false });
  const mocks = mockViewportFixtureState();

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);

  expect(mocks.fixtureState.viewport).toEqual(null);
});

it('sets disabled viewport state on untoggle', async () => {
  register();
  const storageMock = mockEnabledViewportStorage();
  mockRouter({ isFullScreen: () => false });
  mockViewportFixtureState();

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);

  expect(storageMock[VIEWPORT_STORAGE_KEY]).toEqual(
    expect.objectContaining({ enabled: false })
  );
});
