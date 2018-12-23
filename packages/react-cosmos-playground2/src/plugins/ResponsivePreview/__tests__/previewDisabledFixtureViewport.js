// @flow

import React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import {
  cleanup,
  mockConfig,
  mockState,
  mockMethod
} from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

const primaryRendererState = {
  fixtures: ['fooFixture.js'],
  fixtureState: {
    components: [],
    viewport: { width: 420, height: 420 }
  }
};
const initialRendererState = {
  primaryRendererId: 'fooRendererId',
  renderers: {
    fooRendererId: primaryRendererState
  }
};

function registerTestPlugins() {
  register();
  mockConfig('core', { projectId: 'mockProjectId' });
  mockConfig('renderer', { webUrl: 'mockRendererUrl' });
  mockState('router', { urlParams: { fixturePath: 'fooFixture.js' } });
  mockState('renderer', initialRendererState);
  mockMethod('renderer.getPrimaryRendererState', () => primaryRendererState);
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

it('renders responsive header', () => {
  registerTestPlugins();

  const { getByTestId } = loadTestPlugins();
  getByTestId('responsiveHeader');
});
