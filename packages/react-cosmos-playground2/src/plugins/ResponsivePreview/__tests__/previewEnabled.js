// @flow

import React from 'react';
import { wait, render, cleanup, fireEvent } from 'react-testing-library';
import { resetPlugins, registerPlugin, loadPlugins, Slot } from 'react-plugin';
import { updateState } from 'react-cosmos-shared2/util';
import { DEFAULT_DEVICES, getResponsiveViewportStorageKey } from '../shared';
import { register } from '..';

afterEach(() => {
  cleanup();
  resetPlugins();
});

const storageKey = getResponsiveViewportStorageKey('mockProjectId');

it('renders children of "rendererPreviewOuter" slot', () => {
  const { getByTestId } = loadTestPlugins(() => {
    registerRouterPlugin();
    registerRendererPlugin();
  });

  getByTestId('preview-mock');
});

it('does not render responsive header when no fixture is selected', () => {
  const { queryByTestId } = loadTestPlugins(() => {
    registerRouterPlugin();
    registerRendererPlugin();
  });

  expect(queryByTestId('responsive-header')).toBeNull();
});

it('does not render responsive header in full screen mode', () => {
  const { queryByTestId } = loadTestPlugins(() => {
    registerRouterPlugin({ fixturePath: 'fooFixture.js', fullScreen: true });
    registerRendererPlugin();
  });

  expect(queryByTestId('responsive-header')).toBeNull();
});

it('renders responsive header', () => {
  const { getByTestId } = loadTestPlugins(() => {
    registerRouterPlugin({ fixturePath: 'fooFixture.js' });
    registerRendererPlugin();
  });

  getByTestId('responsive-header');
});

it('renders responsive device labels', () => {
  const { getByText } = loadTestPlugins(() => {
    registerRouterPlugin({ fixturePath: 'fooFixture.js' });
    registerRendererPlugin();
  });

  DEFAULT_DEVICES.forEach(({ label }) => {
    getByText(label);
  });
});

describe('on device select', () => {
  it('sets "responsive-preview" state', async () => {
    let state;

    const { getByText } = loadTestPlugins(() => {
      registerStoragePlugin();
      registerRouterPlugin({ fixturePath: 'fooFixture.js' });
      registerRendererPlugin();
      registerPlugin({ name: 'test' }).onState(({ getStateOf }) => {
        state = getStateOf('responsivePreview');
      });
    });

    fireEvent.click(getByText(/iphone 6 plus/i));

    await wait(() =>
      expect(state).toEqual({
        enabled: true,
        viewport: { width: 414, height: 736 }
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
      registerRouterPlugin({ fixturePath: 'fooFixture.js' });
      registerRendererPlugin(handleSetFixtureState);
    });

    fireEvent.click(getByText(/iphone 6 plus/i));

    await wait(() =>
      expect(fixtureState.viewport).toEqual({ width: 414, height: 736 })
    );
  });

  it('saves viewport in storage', async () => {
    let storage = {};

    const { getByText } = loadTestPlugins(() => {
      registerStoragePlugin((context, key, value) =>
        Promise.resolve((storage[key] = value))
      );
      registerRouterPlugin({ fixturePath: 'fooFixture.js' });
      registerRendererPlugin();
    });

    fireEvent.click(getByText(/iphone 6 plus/i));

    await wait(() =>
      expect(storage[storageKey]).toEqual({ width: 414, height: 736 })
    );
  });
});

function loadTestPlugins(extraSetup = () => {}) {
  register();
  registerPlugin({ name: 'core' });
  extraSetup();

  loadPlugins({
    config: {
      core: { projectId: 'mockProjectId' },
      renderer: { webUrl: 'mockRendererUrl' }
    },
    state: {
      responsivePreview: {
        enabled: true,
        viewport: { width: 320, height: 480 }
      }
    }
  });

  return render(
    <Slot name="rendererPreviewOuter">
      <div data-testid="preview-mock" />
    </Slot>
  );
}
function registerStoragePlugin(setItem = () => {}) {
  registerPlugin({ name: 'storage' }).method('setItem', setItem);
}

function registerRouterPlugin(urlParams = {}) {
  registerPlugin({ name: 'router', initialState: { urlParams } });
}

function registerRendererPlugin(setFixtureState = () => {}) {
  const { method } = registerPlugin({
    name: 'renderer',
    initialState: { primaryRendererId: null, renderers: {} }
  });
  method('setFixtureState', setFixtureState);
}
