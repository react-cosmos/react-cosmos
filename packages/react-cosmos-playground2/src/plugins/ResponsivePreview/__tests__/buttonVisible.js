// @flow

import React from 'react';
import { wait, render, fireEvent } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { updateState } from 'react-cosmos-shared2/util';
import {
  cleanup,
  getPluginState,
  mockConfig,
  mockState,
  mockMethod
} from '../../../testHelpers/plugin';
import { DEFAULT_VIEWPORT, getResponsiveViewportStorageKey } from '../shared';
import { register } from '..';

afterEach(cleanup);

const storageKey = getResponsiveViewportStorageKey('mockProjectId');

const mockRendererState = {
  primaryRendererId: 'fooRendererId',
  renderers: {
    fooRendererId: {
      fixtures: ['fooFixture.js'],
      fixtureState: {}
    }
  }
};

function registerTestPlugins() {
  register();
  mockConfig('core', { projectId: 'mockProjectId' });
  mockState('renderer', mockRendererState);
  mockState('router', { urlParams: { fixturePath: 'fooFixture.js' } });
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="header-buttons" />);
}

it('sets enabled state', async () => {
  registerTestPlugins();
  mockMethod('storage.getItem', () => {});
  mockMethod('renderer.setFixtureState', () => {});

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/responsive/i));

  await wait(() =>
    expect(getPluginState('responsivePreview')).toEqual({
      enabled: true,
      viewport: DEFAULT_VIEWPORT
    })
  );
});

it('sets enabled state with stored viewport', async () => {
  registerTestPlugins();
  mockMethod('renderer.setFixtureState', () => {});

  const storage = {
    [storageKey]: { width: 420, height: 420 }
  };
  mockMethod('storage.getItem', (context, key) =>
    Promise.resolve(storage[key])
  );

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/responsive/i));

  await wait(() =>
    expect(getPluginState('responsivePreview')).toEqual({
      enabled: true,
      viewport: { width: 420, height: 420 }
    })
  );
});

it('sets viewport in fixture state', async () => {
  registerTestPlugins();
  mockMethod('storage.getItem', () => {});

  let fixtureState = {};
  const handleSetFixtureState = (context, stateChange) => {
    fixtureState = updateState(fixtureState, stateChange);
  };
  mockMethod('renderer.setFixtureState', handleSetFixtureState);

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/responsive/i));

  await wait(() => expect(fixtureState.viewport).toEqual(DEFAULT_VIEWPORT));
});

it('sets disabled state', async () => {
  registerTestPlugins();
  mockMethod('storage.getItem', () => {});
  mockMethod('renderer.setFixtureState', () => {});

  const { getByText } = loadTestPlugins();

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
  registerTestPlugins();
  mockMethod('renderer.setFixtureState', () => {});

  const storage = {
    [storageKey]: { width: 420, height: 420 }
  };
  mockMethod('storage.getItem', (context, key) =>
    Promise.resolve(storage[key])
  );

  const { getByText } = loadTestPlugins();
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
  registerTestPlugins();
  mockMethod('storage.getItem', () => {});

  let fixtureState = {};
  const handleSetFixtureState = (context, stateChange) => {
    fixtureState = updateState(fixtureState, stateChange);
  };
  mockMethod('renderer.setFixtureState', handleSetFixtureState);

  const { getByText } = loadTestPlugins();
  const getButton = getByText(/responsive/i);
  fireEvent.click(getButton);
  fireEvent.click(getButton);

  await wait(() => expect(fixtureState.viewport).toBe(null));
});
