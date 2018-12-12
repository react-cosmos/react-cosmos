// @flow

import React from 'react';
import { wait, render, fireEvent } from 'react-testing-library';
import { registerPlugin, loadPlugins, Slot } from 'react-plugin';
import { updateState } from 'react-cosmos-shared2/util';
import {
  cleanup,
  getPluginState,
  mockMethod
} from '../../../testHelpers/plugin';
import { DEFAULT_VIEWPORT, getResponsiveViewportStorageKey } from '../shared';
import { register } from '..';

afterEach(cleanup);

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
  const { getByText } = loadTestPlugins(() => {
    mockMethod('storage.getItem', () => {});
    mockMethod('renderer.setFixtureState', () => {});
  });

  fireEvent.click(getByText(/responsive/i));

  await wait(() =>
    expect(getPluginState('responsivePreview')).toEqual({
      enabled: true,
      viewport: DEFAULT_VIEWPORT
    })
  );
});

it('sets enabled state with stored viewport', async () => {
  const storage = {
    [storageKey]: { width: 420, height: 420 }
  };

  const { getByText } = loadTestPlugins(() => {
    mockMethod('storage.getItem', (context, key) =>
      Promise.resolve(storage[key])
    );
    mockMethod('renderer.setFixtureState', () => {});
  });

  fireEvent.click(getByText(/responsive/i));

  await wait(() =>
    expect(getPluginState('responsivePreview')).toEqual({
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
    mockMethod('storage.getItem', () => {});
    mockMethod('renderer.setFixtureState', handleSetFixtureState);
  });

  fireEvent.click(getByText(/responsive/i));

  await wait(() => expect(fixtureState.viewport).toEqual(DEFAULT_VIEWPORT));
});

it('sets disabled state', async () => {
  const { getByText } = loadTestPlugins(() => {
    mockMethod('storage.getItem', () => {});
    mockMethod('renderer.setFixtureState', () => {});
  });

  const getButton = getByText(/responsive/i);
  fireEvent.click(getButton);
  fireEvent.click(getButton);

  await wait(() =>
    expect(getPluginState('responsivePreview')).toEqual({
      enabled: false,
      viewport: DEFAULT_VIEWPORT
    })
  );
});

it('sets disabled state with stored viewport', async () => {
  const storage = {
    [storageKey]: { width: 420, height: 420 }
  };

  const { getByText } = loadTestPlugins(() => {
    mockMethod('storage.getItem', (context, key) =>
      Promise.resolve(storage[key])
    );
    mockMethod('renderer.setFixtureState', () => {});
  });

  const getButton = getByText(/responsive/i);
  fireEvent.click(getButton);
  fireEvent.click(getButton);

  await wait(() =>
    expect(getPluginState('responsivePreview')).toEqual({
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
    mockMethod('storage.getItem', () => {});
    mockMethod('renderer.setFixtureState', handleSetFixtureState);
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
