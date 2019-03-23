import * as React from 'react';
import {
  render,
  waitForElement,
  RenderResult,
  wait
} from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockMethodsOf } from '../../../testHelpers/plugin';
import { StorageSpec } from '../../Storage/public';
import { RouterSpec } from '../../Router/public';
import { CoreSpec } from '../../Core/public';
import { RendererCoreSpec } from '../../RendererCore/public';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockMethodsOf<StorageSpec>('storage', {});
  mockMethodsOf<CoreSpec>('core', {
    getProjectId: () => 'mockProjectId'
  });
  mockMethodsOf<RouterSpec>('router', {
    isFullScreen: () => false
  });
  mockMethodsOf<RendererCoreSpec>('rendererCore', {
    getFixtureState: () => ({}),
    isValidFixtureSelected: () => false
  });
}

function loadTestPlugins() {
  loadPlugins();
  return render(
    <>
      <Slot name="rendererActions" />
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
