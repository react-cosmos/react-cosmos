import React from 'react';
import {
  wait,
  render,
  waitForElement,
  fireEvent,
  RenderResult
} from '@testing-library/react';
import { loadPlugins, Slot, ArraySlot } from 'react-plugin';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { cleanup } from '../../../testHelpers/plugin';
import {
  mockRouter,
  mockStorage,
  mockRendererCore
} from '../../../testHelpers/pluginMocks';
import { DEFAULT_DEVICES, STORAGE_KEY } from '../shared';
import { FixtureStateWithViewport, StorageMock } from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

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
  mockStorage();
  mockRouter({ isFullScreen: () => false });
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true
  });

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);
  await waitForElement(() => renderer.getByTestId('previewMock'));
});

it('does not render responsive header when no fixture is selected', async () => {
  register();
  mockStorage();
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
  mockStorage();
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
  mockStorage();
  mockRouter({ isFullScreen: () => false });
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true
  });

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);
  await waitForElement(() => renderer.getByTestId('responsiveHeader'));
});

it('renders responsive device labels', async () => {
  register();
  mockStorage();
  mockRouter({ isFullScreen: () => false });
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true
  });

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);
  for (const device of DEFAULT_DEVICES) {
    await waitForElement(() => renderer.getByText(device.label));
  }
});

describe('on device select', () => {
  it('sets viewport in fixture state', async () => {
    register();
    mockStorage();
    mockRouter({ isFullScreen: () => false });

    let fixtureState: FixtureState = {};
    mockRendererCore({
      getFixtureState: () => ({}),
      isValidFixtureSelected: () => true,
      setFixtureState: (context, stateUpdater) => {
        fixtureState = stateUpdater(fixtureState);
      }
    });

    const renderer = loadTestPlugins();
    await toggleResponsiveMode(renderer);
    await selectViewport(renderer, '414x736');

    await wait(() =>
      expect((fixtureState as FixtureStateWithViewport).viewport).toEqual({
        width: 414,
        height: 736
      })
    );
  });

  it('saves viewport in storage', async () => {
    register();

    const storage: StorageMock = {};
    mockStorage({
      setItem: (context, key, value) => {
        storage[key] = value;
      }
    });

    mockRouter({ isFullScreen: () => false });
    mockRendererCore({
      getFixtureState: () => ({}),
      isValidFixtureSelected: () => true
    });

    const renderer = loadTestPlugins();
    await toggleResponsiveMode(renderer);
    await selectViewport(renderer, '414x736');

    await wait(() =>
      expect(storage[STORAGE_KEY]).toEqual({ width: 414, height: 736 })
    );
  });
});

it('clears viewport in fixture state on untoggle', async () => {
  register();
  mockStorage();
  mockRouter({ isFullScreen: () => false });

  let fixtureState: FixtureState = {};
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => true,
    setFixtureState: (context, stateUpdater) => {
      fixtureState = stateUpdater(fixtureState);
    }
  });

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);
  await selectViewport(renderer, '414x736');
  await toggleResponsiveMode(renderer);

  await wait(() =>
    expect((fixtureState as FixtureStateWithViewport).viewport).toEqual(null)
  );
});
