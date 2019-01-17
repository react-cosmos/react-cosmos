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

const fixtureState = {
  components: [],
  viewport: { width: 420, height: 420 }
};

function registerTestPlugins() {
  register();
  mockConfig('core', { projectId: 'mockProjectId' });
  mockState('router', { urlParams: { fixturePath: 'fooFixture.js' } });
  mockState('renderer', { fixtureState });
  mockMethod('renderer.isValidFixtureSelected', () => true);
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
