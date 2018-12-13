// @flow

import React from 'react';
import { wait, render, fireEvent } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import {
  cleanup,
  getPluginState,
  mockConfig,
  mockState,
  mockMethod
} from '../../../testHelpers/plugin';
import { updateState } from 'react-cosmos-shared2/util';
import { DEFAULT_DEVICES, getResponsiveViewportStorageKey } from '../shared';
import { register } from '..';

afterEach(cleanup);

const storageKey = getResponsiveViewportStorageKey('mockProjectId');

function registerTestPlugins({
  urlParams = {},
  handleSetFixtureState = () => {}
}: { urlParams?: {}, handleSetFixtureState?: Function } = {}) {
  register();
  mockConfig('core', { projectId: 'mockProjectId' });
  mockConfig('renderer', { webUrl: 'mockRendererUrl' });
  mockState('router', { urlParams });
  mockState('renderer', { primaryRendererId: null, renderers: {} });
  mockMethod('renderer.setFixtureState', handleSetFixtureState);
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
      <div data-testid="preview-mock" />
    </Slot>
  );
}

it('renders children of "rendererPreviewOuter" slot', () => {
  registerTestPlugins();

  const { getByTestId } = loadTestPlugins();
  getByTestId('preview-mock');
});

it('does not render responsive header when no fixture is selected', () => {
  registerTestPlugins();

  const { queryByTestId } = loadTestPlugins();
  expect(queryByTestId('responsive-header')).toBeNull();
});

it('does not render responsive header in full screen mode', () => {
  registerTestPlugins({
    urlParams: { fixturePath: 'fooFixture.js', fullScreen: true }
  });

  const { queryByTestId } = loadTestPlugins();
  expect(queryByTestId('responsive-header')).toBeNull();
});

it('renders responsive header', () => {
  registerTestPlugins({ urlParams: { fixturePath: 'fooFixture.js' } });

  const { getByTestId } = loadTestPlugins();
  getByTestId('responsive-header');
});

it('renders responsive device labels', () => {
  registerTestPlugins({ urlParams: { fixturePath: 'fooFixture.js' } });

  const { getByText } = loadTestPlugins();
  DEFAULT_DEVICES.forEach(({ label }) => {
    getByText(label);
  });
});

describe('on device select', () => {
  it('sets "responsive-preview" state', async () => {
    registerTestPlugins({ urlParams: { fixturePath: 'fooFixture.js' } });
    mockMethod('storage.setItem', () => {});

    const { getByText } = loadTestPlugins();
    fireEvent.click(getByText(/iphone 6 plus/i));

    await wait(() =>
      expect(getPluginState('responsivePreview')).toEqual({
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

    registerTestPlugins({
      urlParams: { fixturePath: 'fooFixture.js' },
      handleSetFixtureState
    });
    mockMethod('storage.setItem', () => {});

    const { getByText } = loadTestPlugins();
    fireEvent.click(getByText(/iphone 6 plus/i));

    await wait(() =>
      expect(fixtureState.viewport).toEqual({ width: 414, height: 736 })
    );
  });

  it('saves viewport in storage', async () => {
    registerTestPlugins({ urlParams: { fixturePath: 'fooFixture.js' } });

    let storage = {};
    mockMethod('storage.setItem', (context, key, value) =>
      Promise.resolve((storage[key] = value))
    );

    const { getByText } = loadTestPlugins();
    fireEvent.click(getByText(/iphone 6 plus/i));

    await wait(() =>
      expect(storage[storageKey]).toEqual({ width: 414, height: 736 })
    );
  });
});
