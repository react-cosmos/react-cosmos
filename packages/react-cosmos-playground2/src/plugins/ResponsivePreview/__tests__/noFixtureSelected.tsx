import * as React from 'react';
import {
  render,
  waitForElement,
  RenderResult,
  wait
} from 'react-testing-library';
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
      <ArraySlot name="rendererActions" />
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
  const { getByText } = loadTestPlugins();
  await wait(() =>
    expect(getByText(/responsive/i)).toHaveAttribute('disabled')
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
