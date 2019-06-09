import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import {
  mockStorage,
  mockRouter,
  mockRendererCore
} from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

const fixtureState = {
  viewport: { width: 420, height: 420 }
};

function registerTestPlugins() {
  register();
  mockStorage();
  mockRouter({
    isFullScreen: () => false
  });
  mockRendererCore({
    getFixtureState: () => fixtureState,
    isValidFixtureSelected: () => true
  });
}

function loadTestPlugins() {
  loadPlugins();
  return render(
    <Slot name="rendererPreviewOuter">
      <div data-testid="previewMock" />
    </Slot>
  );
}

it('renders responsive header', async () => {
  registerTestPlugins();

  const { getByTestId } = loadTestPlugins();
  await waitForElement(() => getByTestId('responsiveHeader'));
});
