// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockConfig, mockState } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

const defaultRendererState = { primaryRendererId: null, renderers: {} };

function registerTestPlugins({
  urlParams = {},
  rendererState = defaultRendererState
}: { urlParams?: {}, rendererState?: {} } = {}) {
  register();
  mockConfig('core', { projectId: 'mockProjectId' });
  mockConfig('renderer', { webUrl: 'mockRendererUrl' });
  mockState('router', { urlParams });
  mockState('renderer', rendererState);
}

function loadTestPlugins() {
  loadPlugins({
    state: { responsivePreview: { enabled: false, viewport: null } }
  });

  return render(
    <Slot name="rendererPreviewOuter">
      <div data-testid="previewMock" />
    </Slot>
  );
}

it('renders children of "rendererPreviewOuter" slot', () => {
  registerTestPlugins();

  const { getByTestId } = loadTestPlugins();
  getByTestId('previewMock');
});

it('does not render responsive header', () => {
  registerTestPlugins({ urlParams: { fixturePath: 'fooFixture.js' } });

  const { queryByTestId } = loadTestPlugins();
  expect(queryByTestId('responsiveHeader')).toBeNull();
});

it('renders responsive header when fixture has viewport', () => {
  registerTestPlugins({
    urlParams: { fixturePath: 'fooFixture.js' },
    rendererState: {
      primaryRendererId: 'fooRendererId',
      renderers: {
        fooRendererId: {
          fixtures: ['fooFixture.js'],
          fixtureState: {
            viewport: { width: 420, height: 420 }
          }
        }
      }
    }
  });

  const { getByTestId } = loadTestPlugins();
  getByTestId('responsiveHeader');
});
