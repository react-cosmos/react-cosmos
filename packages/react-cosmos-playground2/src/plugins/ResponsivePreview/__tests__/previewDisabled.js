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

function registerTestPlugins() {
  register();
  mockConfig('core', { projectId: 'mockProjectId' });
  mockState('router', { urlParams: { fixturePath: 'fooFixture.js' } });
  mockState('renderer', { fixtureState: null });
  mockMethod('renderer.isValidFixtureSelected', () => false);
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
  registerTestPlugins();

  const { queryByTestId } = loadTestPlugins();
  expect(queryByTestId('responsiveHeader')).toBeNull();
});
