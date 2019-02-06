import * as React from 'react';
import { wait, render, fireEvent } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { updateState } from 'react-cosmos-shared2/util';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { cleanup, getState, mockMethodsOf } from '../../../testHelpers/plugin';
import { StorageSpec } from '../../Storage/public';
import { UrlParams, RouterSpec } from '../../Router/public';
import { CoreSpec } from '../../Core/public';
import { RendererCoordinatorSpec } from '../../RendererCoordinator/public';
import { ResponsivePreviewSpec } from '../public';
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
    setItem: (context, key, value) => {
      storage[key] = value;
      return Promise.resolve();
    }
  });
}

function mockRouter(urlParams: UrlParams = {}) {
  mockMethodsOf<RouterSpec>('router', {
    getUrlParams: () => urlParams
  });
}

function mockRendererCoordinator(
  validFixtureSelected: boolean,
  setFixtureState: SetFixtureStateHandler = () => {}
) {
  mockMethodsOf<RendererCoordinatorSpec>('rendererCoordinator', {
    getFixtureState: () => null,
    isValidFixtureSelected: () => validFixtureSelected,
    setFixtureState
  });
}

function loadTestPlugins() {
  loadPlugins({
    state: {
      responsivePreview: {
        enabled: true,
        viewport: { width: 320, height: 480 }
      }
    }
  });

  return render(
    <Slot name="rendererPreviewOuter">
      <div data-testid="previewMock" />
    </Slot>
  );
}

it('renders children of "rendererPreviewOuter" slot', () => {
  registerTestPlugins();
  mockStorage();
  mockRouter();
  mockRendererCoordinator(false);

  const { getByTestId } = loadTestPlugins();
  getByTestId('previewMock');
});

it('does not render responsive header when no fixture is selected', () => {
  registerTestPlugins();
  mockStorage();
  mockRouter();
  mockRendererCoordinator(false);

  const { queryByTestId } = loadTestPlugins();
  expect(queryByTestId('responsiveHeader')).toBeNull();
});

it('does not render responsive header in full screen mode', () => {
  registerTestPlugins();
  mockStorage();
  mockRouter({ fixturePath: 'foo.js', fullScreen: true });
  mockRendererCoordinator(true);

  const { queryByTestId } = loadTestPlugins();
  expect(queryByTestId('responsiveHeader')).toBeNull();
});

it('renders responsive header', () => {
  registerTestPlugins();
  mockStorage();
  mockRouter({ fixturePath: 'foo.js' });
  mockRendererCoordinator(true);

  const { getByTestId } = loadTestPlugins();
  getByTestId('responsiveHeader');
});

it('renders responsive device labels', () => {
  registerTestPlugins();
  mockStorage();
  mockRouter({ fixturePath: 'foo.js' });
  mockRendererCoordinator(true);

  const { getByText } = loadTestPlugins();
  DEFAULT_DEVICES.forEach(({ label }) => {
    getByText(label);
  });
});

describe('on device select', () => {
  it('sets "responsive-preview" state', async () => {
    registerTestPlugins();
    mockStorage();
    mockRouter({ fixturePath: 'foo.js' });
    mockRendererCoordinator(true);

    const { getByText } = loadTestPlugins();
    fireEvent.click(getByText(/iphone 6 plus/i));

    await wait(() =>
      expect(getState<ResponsivePreviewSpec>('responsivePreview')).toEqual({
        enabled: true,
        viewport: { width: 414, height: 736 }
      })
    );
  });

  it('sets viewport in fixture state', async () => {
    registerTestPlugins();
    mockStorage();
    mockRouter({ fixturePath: 'foo.js' });
    mockRendererCoordinator(true);

    let fixtureState: null | FixtureState = null;
    mockRendererCoordinator(true, (context, stateChange) => {
      fixtureState = updateState(fixtureState, stateChange);
    });

    const { getByText } = loadTestPlugins();
    fireEvent.click(getByText(/iphone 6 plus/i));

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

    mockRouter({ fixturePath: 'fooFixture.js' });
    mockRendererCoordinator(true);

    const { getByText } = loadTestPlugins();
    fireEvent.click(getByText(/iphone 6 plus/i));

    await wait(() =>
      expect(storage[storageKey]).toEqual({ width: 414, height: 736 })
    );
  });
});
