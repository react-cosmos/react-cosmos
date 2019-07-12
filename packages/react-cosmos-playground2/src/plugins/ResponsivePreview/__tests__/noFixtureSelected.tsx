import React from 'react';
import {
  render,
  waitForElement,
  RenderResult,
  wait
} from '@testing-library/react';
import { loadPlugins, Slot, ArraySlot } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import { register } from '..';
import {
  mockStorage,
  mockRouter,
  mockRendererCore
} from '../../../testHelpers/pluginMocks';

afterEach(cleanup);

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

async function waitForMainPlug({ getByTestId }: RenderResult) {
  await waitForElement(() => getByTestId('responsivePreview'));
}

it('renders disabled button', async () => {
  registerTestPlugins();
  const { getByTitle } = loadTestPlugins();
  await wait(() =>
    expect(getByTitle(/toggle responsive mode/i)).toHaveAttribute('disabled')
  );
});

it('renders children of "rendererPreviewOuter" slot', async () => {
  registerTestPlugins();
  const { getByTestId } = loadTestPlugins();
  await waitForElement(() => getByTestId('previewMock'));
});

it('does not render responsive header', async () => {
  registerTestPlugins();
  const renderer = loadTestPlugins();
  await waitForMainPlug(renderer);
  expect(renderer.queryByTestId('responsiveHeader')).toBeNull();
});
