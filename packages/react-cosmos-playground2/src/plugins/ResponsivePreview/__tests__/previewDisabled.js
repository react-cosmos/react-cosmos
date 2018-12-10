// @flow

import React from 'react';
import { render, cleanup } from 'react-testing-library';
import { resetPlugins, registerPlugin, loadPlugins, Slot } from 'react-plugin';
import { register } from '..';

afterEach(() => {
  cleanup();
  resetPlugins();
});

it('renders children of "rendererPreviewOuter" slot', () => {
  const { getByTestId } = loadTestPlugins(() => {
    registerRouterPlugin();
    registerRendererPlugin();
  });

  getByTestId('preview-mock');
});

it('does not render responsive header', () => {
  const { queryByTestId } = loadTestPlugins(() => {
    registerRouterPlugin({ fixturePath: 'fooFixture.js' });
    registerRendererPlugin();
  });

  expect(queryByTestId('responsive-header')).toBeNull();
});

it('renders responsive header when fixture has viewport', () => {
  const { getByTestId } = loadTestPlugins(() => {
    registerRouterPlugin({ fixturePath: 'fooFixture.js' });
    registerRendererPlugin({
      primaryRendererId: 'fooRendererId',
      renderers: {
        fooRendererId: {
          fixtures: ['fooFixture.js'],
          fixtureState: {
            viewport: { width: 420, height: 420 }
          }
        }
      }
    });
  });

  getByTestId('responsive-header');
});

function loadTestPlugins(extraSetup = () => {}) {
  register();
  registerPlugin({ name: 'core' });
  extraSetup();

  loadPlugins({
    config: {
      renderer: { webUrl: 'mockRendererUrl' }
    },
    state: {
      responsivePreview: { enabled: false, viewport: null }
    }
  });

  return render(
    <Slot name="rendererPreviewOuter">
      <div data-testid="preview-mock" />
    </Slot>
  );
}

function registerRouterPlugin(urlParams = {}) {
  registerPlugin({ name: 'router', initialState: { urlParams } });
}

function registerRendererPlugin(
  state = { primaryRendererId: null, renderers: {} }
) {
  registerPlugin({ name: 'renderer', initialState: state });
}
