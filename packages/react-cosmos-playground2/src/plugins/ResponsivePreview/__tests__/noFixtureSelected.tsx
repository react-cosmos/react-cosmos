import React from 'react';
import { render } from '@testing-library/react';
import { loadPlugins, Slot, ArraySlot, resetPlugins } from 'react-plugin';
import { register } from '..';
import {
  mockStorage,
  mockRouter,
  mockRendererCore
} from '../../../testHelpers/pluginMocks';

afterEach(resetPlugins);

function registerTestPlugins() {
  register();
  mockStorage();
  mockRouter({
    isFullScreen: () => false
  });
  mockRendererCore({
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => false
  });
}

function loadTestPlugins() {
  loadPlugins();
  return render(
    <>
      <ArraySlot name="rendererAction" />
      <Slot name="rendererPreviewOuter">
        <div data-testid="previewMock" />
      </Slot>
    </>
  );
}

it('renders disabled button', async () => {
  registerTestPlugins();
  const { getByTitle } = loadTestPlugins();
  expect(getByTitle(/toggle responsive mode/i)).toHaveAttribute('disabled');
});

it('renders children of "rendererPreviewOuter" slot', async () => {
  registerTestPlugins();
  const { getByTestId } = loadTestPlugins();
  getByTestId('previewMock');
});

it('does not render responsive header', async () => {
  registerTestPlugins();
  const renderer = loadTestPlugins();
  renderer.getByTestId('responsivePreview');
  expect(renderer.queryByTestId('responsiveHeader')).toBeNull();
});
