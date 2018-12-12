// @flow

import React from 'react';
import { wait, render, cleanup, fireEvent } from 'react-testing-library';
import {
  resetPlugins,
  registerPlugin,
  loadPlugins,
  Slot,
  onStateChange,
  getPluginContext
} from 'react-plugin';
import { updateState } from 'react-cosmos-shared2/util';
import { DEFAULT_VIEWPORT, getResponsiveViewportStorageKey } from '../shared';
import { register } from '..';

afterEach(() => {
  cleanup();
  resetPlugins();
});

const storageKey = getResponsiveViewportStorageKey('mockProjectId');

afterEach(cleanup);

const mockRendererState = {
  primaryRendererId: 'fooRendererId',
  renderers: {
    fooRendererId: {
      fixtures: ['fooFixture.js'],
      fixtureState: {}
    }
  }
};

it('sets enabled state', async () => {
  let state;

  const { getByText } = loadTestPlugins(() => {
    registerStoragePlugin();
    registerRendererPlugin();
    onStateChange(() => {
      state = getPluginContext('responsivePreview').getState();
    });
  });

  fireEvent.click(getByText(/responsive/i));

  await wait(() =>
    expect(state).toEqual({
      enabled: true,
      viewport: DEFAULT_VIEWPORT
    })
  );
});

it('sets enabled state with stored viewport', async () => {
  const storage = {
    [storageKey]: { width: 420, height: 420 }
  };
  let state;

  const { getByText } = loadTestPlugins(() => {
    registerStoragePlugin((context, key) => Promise.resolve(storage[key]));
    registerRendererPlugin();
    onStateChange(() => {
      state = getPluginContext('responsivePreview').getState();
    });
  });

  fireEvent.click(getByText(/responsive/i));

  await wait(() =>
    expect(state).toEqual({
      enabled: true,
      viewport: { width: 420, height: 420 }
    })
  );
});

it('sets viewport in fixture state', async () => {
  let fixtureState = {};
  const handleSetFixtureState = (context, stateChange) => {
    fixtureState = updateState(fixtureState, stateChange);
  };

  const { getByText } = loadTestPlugins(() => {
    registerStoragePlugin();
    registerRendererPlugin(handleSetFixtureState);
  });

  fireEvent.click(getByText(/responsive/i));

  await wait(() => expect(fixtureState.viewport).toEqual(DEFAULT_VIEWPORT));
});

it('sets disabled state', async () => {
  let state;

  const { getByText } = loadTestPlugins(() => {
    registerStoragePlugin();
    registerRendererPlugin();
    onStateChange(() => {
      state = getPluginContext('responsivePreview').getState();
    });
  });

  const getButton = getByText(/responsive/i);
  fireEvent.click(getButton);
  fireEvent.click(getButton);

  await wait(() =>
    expect(state).toEqual({
      enabled: false,
      viewport: DEFAULT_VIEWPORT
    })
  );
});

it('sets disabled state with stored viewport', async () => {
  const storage = {
    [storageKey]: { width: 420, height: 420 }
  };
  let state;

  const { getByText } = loadTestPlugins(() => {
    registerStoragePlugin((context, key) => Promise.resolve(storage[key]));
    registerRendererPlugin();
    onStateChange(() => {
      state = getPluginContext('responsivePreview').getState();
    });
  });

  const getButton = getByText(/responsive/i);
  fireEvent.click(getButton);
  fireEvent.click(getButton);

  await wait(() =>
    expect(state).toEqual({
      enabled: false,
      viewport: { width: 420, height: 420 }
    })
  );
});

it('clears viewport in fixture state', async () => {
  let fixtureState = {};
  const handleSetFixtureState = (context, stateChange) => {
    fixtureState = updateState(fixtureState, stateChange);
  };

  const { getByText } = loadTestPlugins(() => {
    registerStoragePlugin();
    registerRendererPlugin(handleSetFixtureState);
  });

  const getButton = getByText(/responsive/i);
  fireEvent.click(getButton);
  fireEvent.click(getButton);

  await wait(() => expect(fixtureState.viewport).toBe(null));
});

function loadTestPlugins(extraSetup = () => {}) {
  register();
  registerPlugin({ name: 'core' });
  registerPlugin({ name: 'router' });
  extraSetup();

  loadPlugins({
    config: {
      core: { projectId: 'mockProjectId' }
    },
    state: {
      renderer: mockRendererState,
      router: { urlParams: { fixturePath: 'fooFixture.js' } },
      responsivePreview: { enabled: false, viewport: null }
    }
  });

  return render(<Slot name="header-buttons" />);
}

function registerStoragePlugin(getItem = () => {}) {
  registerPlugin({ name: 'storage' }).method('getItem', getItem);
}

function registerRendererPlugin(setFixtureState = () => {}) {
  const { method } = registerPlugin({ name: 'renderer' });
  method('setFixtureState', setFixtureState);
}
