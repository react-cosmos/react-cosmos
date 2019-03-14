import * as React from 'react';
import {
  wait,
  render,
  waitForElement,
  fireEvent,
  RenderResult
} from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { updateState } from 'react-cosmos-shared2/util';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { cleanup, mockMethodsOf } from '../../../testHelpers/plugin';
import { StorageSpec } from '../../Storage/public';
import { RouterSpec } from '../../Router/public';
import { CoreSpec } from '../../Core/public';
import { RendererCoreSpec } from '../../RendererCore/public';
import { DEFAULT_DEVICES, getResponsiveViewportStorageKey } from '../shared';
import {
  IFixtureStateWithViewport,
  StorageMock,
  SetFixtureStateHandler
} from '../testHelpers';
import { register } from '..';

afterEach(cleanup);

const storageKey = getResponsiveViewportStorageKey('mockProjectId');

function registerTestPlugins() {
  register();
  mockMethodsOf<CoreSpec>('core', {
    getProjectId: () => 'mockProjectId'
  });
}

function mockStorage(storage: StorageMock = {}) {
  mockMethodsOf<StorageSpec>('storage', {
    getItem: (context, key) => Promise.resolve(storage[key]),
    setItem: (context, key, value) => {
      storage[key] = value;
      return Promise.resolve();
    }
  });
}

function mockRouter(fullScreen: boolean = false) {
  mockMethodsOf<RouterSpec>('router', {
    isFullScreen: () => fullScreen
  });
}

function mockRendererCore(
  validFixtureSelected: boolean,
  setFixtureState: SetFixtureStateHandler = () => {}
) {
  mockMethodsOf<RendererCoreSpec>('rendererCore', {
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => validFixtureSelected,
    setFixtureState
  });
}

function loadTestPlugins() {
  loadPlugins();
  return render(
    <>
      <Slot name="fixtureActions" />
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
  registerTestPlugins();
  mockStorage();
  mockRouter();
  mockRendererCore(true);

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);
  await waitForElement(() => renderer.getByTestId('previewMock'));
});

it('does not render responsive header when no fixture is selected', async () => {
  registerTestPlugins();
  mockStorage();
  mockRouter();
  mockRendererCore(false);

  const renderer = loadTestPlugins();
  await waitForMainPlug(renderer);
  expect(renderer.queryByTestId('responsiveHeader')).toBeNull();
});

it('does not render responsive header in full screen mode', async () => {
  registerTestPlugins();
  mockStorage();
  mockRouter(true);
  mockRendererCore(true);

  const renderer = loadTestPlugins();
  await waitForMainPlug(renderer);
  expect(renderer.queryByTestId('responsiveHeader')).toBeNull();
});

it('renders responsive header', async () => {
  registerTestPlugins();
  mockStorage();
  mockRouter();
  mockRendererCore(true);

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);
  await waitForElement(() => renderer.getByTestId('responsiveHeader'));
});

it('renders responsive device labels', async () => {
  registerTestPlugins();
  mockStorage();
  mockRouter();
  mockRendererCore(true);

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);
  for (const device of DEFAULT_DEVICES) {
    await waitForElement(() => renderer.getByText(device.label));
  }
});

describe('on device select', () => {
  it('sets viewport in fixture state', async () => {
    registerTestPlugins();
    mockStorage();
    mockRouter();
    mockRendererCore(true);

    let fixtureState: FixtureState = {};
    mockRendererCore(true, (context, stateUpdate) => {
      fixtureState = updateState(fixtureState, stateUpdate);
    });

    const renderer = loadTestPlugins();
    await toggleResponsiveMode(renderer);
    await selectViewport(renderer, /iphone 6 plus/i);

    await wait(() =>
      expect((fixtureState as IFixtureStateWithViewport).viewport).toEqual({
        width: 414,
        height: 736
      })
    );
  });

  it('saves viewport in storage', async () => {
    registerTestPlugins();

    const storage: StorageMock = {};
    mockStorage(storage);

    mockRouter();
    mockRendererCore(true);

    const renderer = loadTestPlugins();
    await toggleResponsiveMode(renderer);
    await selectViewport(renderer, /iphone 6 plus/i);

    await wait(() =>
      expect(storage[storageKey]).toEqual({ width: 414, height: 736 })
    );
  });
});

it('clears viewport in fixture state on untoggle', async () => {
  registerTestPlugins();
  mockStorage();
  mockRouter();
  mockRendererCore(true);

  let fixtureState: FixtureState = {};
  mockRendererCore(true, (context, stateUpdate) => {
    fixtureState = updateState(fixtureState, stateUpdate);
  });

  const renderer = loadTestPlugins();
  await toggleResponsiveMode(renderer);
  await selectViewport(renderer, /iphone 6 plus/i);
  await toggleResponsiveMode(renderer);

  await wait(() =>
    expect((fixtureState as IFixtureStateWithViewport).viewport).toEqual(null)
  );
});
