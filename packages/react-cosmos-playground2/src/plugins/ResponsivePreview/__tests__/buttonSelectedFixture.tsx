import * as React from 'react';
import { wait, render, fireEvent } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { updateState } from 'react-cosmos-shared2/util';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { cleanup, getState, mockMethodsOf } from '../../../testHelpers/plugin2';
import { StorageSpec } from '../../Storage/public';
import { CoreSpec } from '../../Core/public';
import { RendererCoordinatorSpec } from '../../RendererCoordinator/public';
import { ResponsivePreviewSpec } from '../public';
import { DEFAULT_VIEWPORT, getResponsiveViewportStorageKey } from '../shared';
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
    getItem: (context, key) => Promise.resolve(storage[key])
  });
}

function mockRendererCoordinator(
  setFixtureState: SetFixtureStateHandler = () => {}
) {
  mockMethodsOf<RendererCoordinatorSpec>('rendererCoordinator', {
    getFixtureState: () => null,
    isValidFixtureSelected: () => true,
    setFixtureState
  });
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="fixtureActions" />);
}

function getResponsivePreviewState() {
  return getState<ResponsivePreviewSpec>('responsivePreview');
}

it('sets enabled state', async () => {
  registerTestPlugins();
  mockStorage();
  mockRendererCoordinator();

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/responsive/i));

  await wait(() =>
    expect(getResponsivePreviewState()).toEqual({
      enabled: true,
      viewport: DEFAULT_VIEWPORT
    })
  );
});

it('sets enabled state with stored viewport', async () => {
  registerTestPlugins();
  mockStorage({ [storageKey]: { width: 420, height: 420 } });
  mockRendererCoordinator();

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/responsive/i));

  await wait(() =>
    expect(getResponsivePreviewState()).toEqual({
      enabled: true,
      viewport: { width: 420, height: 420 }
    })
  );
});

it('sets viewport in fixture state', async () => {
  registerTestPlugins();
  mockStorage();

  let fixtureState: null | FixtureState = null;
  mockRendererCoordinator((context, stateChange) => {
    fixtureState = updateState(fixtureState, stateChange);
  });

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/responsive/i));

  await wait(() =>
    expect((fixtureState as IFixtureStateWithViewport).viewport).toEqual(
      DEFAULT_VIEWPORT
    )
  );
});

it('sets disabled state', async () => {
  registerTestPlugins();
  mockStorage();
  mockRendererCoordinator();

  const { getByText } = loadTestPlugins();

  const getButton = getByText(/responsive/i);
  fireEvent.click(getButton);
  fireEvent.click(getButton);

  await wait(() =>
    expect(getResponsivePreviewState()).toEqual({
      enabled: false,
      viewport: DEFAULT_VIEWPORT
    })
  );
});

it('sets disabled state with stored viewport', async () => {
  registerTestPlugins();
  mockStorage({ [storageKey]: { width: 420, height: 420 } });
  mockRendererCoordinator();

  const { getByText } = loadTestPlugins();
  const getButton = getByText(/responsive/i);
  fireEvent.click(getButton);
  fireEvent.click(getButton);

  await wait(() =>
    expect(getResponsivePreviewState()).toEqual({
      enabled: false,
      viewport: { width: 420, height: 420 }
    })
  );
});

it('clears viewport in fixture state', async () => {
  registerTestPlugins();
  mockStorage();

  let fixtureState: null | FixtureState = null;
  mockRendererCoordinator((context, stateChange) => {
    fixtureState = updateState(fixtureState, stateChange);
  });

  const { getByText } = loadTestPlugins();
  const getButton = getByText(/responsive/i);
  fireEvent.click(getButton);
  fireEvent.click(getButton);

  await wait(() =>
    expect((fixtureState as IFixtureStateWithViewport).viewport).toBe(null)
  );
});
