import * as React from 'react';
import {
  wait,
  render,
  waitForElement,
  fireEvent,
  RenderResult
} from 'react-testing-library';
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
      <ArraySlot name="rendererActions" />
      <Slot name="rendererPreviewOuter">
        <div data-testid="previewMock" />
      </Slot>
    </>
  );
}

async function waitForMainPlug({ getByTestId }: RenderResult) {
  await waitForElement(() => getByTestId('responsivePreview'));
}

async function toggleResponsiveMode({ getByText }: RenderResult) {
  fireEvent.click(await waitForElement(() => getByText(/responsive/i)));
}

async function selectViewport({ getByText }: RenderResult, match: RegExp) {
  fireEvent.click(await waitForElement(() => getByText(match)));
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
  await waitForMainPlug(renderer);
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
  await waitForMainPlug(renderer);
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
    await selectViewport(renderer, /iphone 6 plus/i);

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
    await selectViewport(renderer, /iphone 6 plus/i);

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
  await selectViewport(renderer, /iphone 6 plus/i);
  await toggleResponsiveMode(renderer);

  await wait(() =>
    expect((fixtureState as FixtureStateWithViewport).viewport).toEqual(null)
  );
});
